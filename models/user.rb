
require 'google_drive'
class User
  include DataMapper::Resource

  property :id, Serial
  property :google_auth_id, String
  property :email, String, format: ->(n) { $andelans.include? n }, required: true, unique: true
  property :pair, String, format: :email_address, unique: true
  property :gift_for_pair, Text

  def generate_pair
    return pair if pair
    # all_unpaired
    @pair_delans ||= $andelans.select { |n| (n != email) && !($uninterested_fellows.include? n) }
    begin
      pair = @pair_delans.sample
      pair_user = User.first(email: pair)

      self.pair = pair
    end while(User.first(pair: pair) || email == pair || (pair_user && pair_user.pair == email))
    save
    self.pair
  end

  def pair_gift
    self.gift_for_pair || 'No Gift Registered Yet'
  end

  class << self
    def paired
      all(:pair.not => nil)
    end

    def unpaired
      all(pair: nil)
    end

    def not_registered
      registered = all_registered
      $andelans.select do |n|
        !registered.include?(n) && !$uninterested_fellows.include?(n)
      end
    end

    def all_registered
      collect(&:email)
    end

    def breakpoints
      select do |user|
        pair = user.pair
        pair_user = first(email: pair)
        (pair_user && pair_user.pair == user.email)
      end
    end

    def remove_uninterested_fellows
      fellows = all(email: $uninterested_fellows).destroy
      paired_with = all(pair: $uninterested_fellows)
      paired_with.update(pair: nil)
      File.open('affected_fellows.txt', 'a+') do |f|
        f.puts paired_with.collect{ |u| [u.id, u.email].join(", ") }
      end
    end

    def remove_pair
      fellows = all(email: ($wants_pair_changed || []))
      # puts fellows.collect(&:email)
      fellows.update(pair: nil)
    end

    def check_pair(email)
      all(pair: email)
    end

    def find_by_email(email)
      all(email: email)
    end

    def without_pairs
      wp = []
      $andelans.each{ |andelan|
        if check_pair(andelan).blank?
          wp << User.first(email: andelan) unless $uninterested_fellows.include?(andelan)
        end
      }
      wp
    end

    def google_drive_session
      $google_drive_session ||= GoogleDrive.saved_session("auth.json")
    end

    def spreadsheet
      google_drive_session.spreadsheet_by_key(ENV['GSHEET_ID']).worksheets[0]
    end

    def populate_registry
        all_data = spreadsheet.rows
        all_data.each do |user_gift_map|
          user = user_gift_map[2].strip
          next if(user.blank? || !user.match($andela_mail))
          if user == 'oreoluwa.akinniranye@andela.com'
            gift = user_gift_map[4].gsub('||', "\n")
          else
            gift = user_gift_map[4]
          end
          paired_w = first(pair: user)
          paired_w.update(gift_for_pair: gift) if paired_w
        end
    end
  end
end
