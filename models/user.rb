
require 'google_drive'
class User
  include DataMapper::Resource

  property :id, Serial
  property :google_auth_id, String
  property :email, String, format: ->(n) { n.match(ANDELA_MAIL_FORMAT) }, required: true, unique: true
  property :pair, String, format: :email_address, unique: true
  property :gift_for_pair, Text
  property :admin, Boolean, default: false
  property :interested_2016, Boolean
  property :wishlist, Text

  belongs_to :santee, 'User' , required: false
  has 1, :santa, 'User', child_key: :santee_id

  def unpaired?
    santee.nil?
  end

  def paired?
    santee
  end

  def generate_pair
    return santee if santee
    unpaired = User.unpaired
    begin
      potential_pair = unpaired.sample
      self.santee = potential_pair
    end while pair_taken(potential_pair) || paired_with_self?(potential_pair) || santa_is_santee?(potential_pair)
    save
    santee
  end

  def pair_taken(pair)
    User.first(santee: pair)
  end

  def paired_with_self?(pair)
    self == pair
  end

  def santa_is_santee?(pair)
    (pair.santee == self)
  end

  def pair_gift
    santee.wishlist
  end

  class << self
    def registered
      all(interested_2016: true)
    end

    def paired
      all(:santee.not => nil)
    end

    def unpaired
      all(santee: nil)
    end

    def not_interested
      all(interested_2016: false)
    end

    def all_registered
      collect(&:email)
    end

    def without_santas
      all(santa: nil)
    end

    def breakpoints
      select do |user|
        pair = user.santee
        next if pair.nil?
        user.santa_is_santee?(pair) || user.paired_with_self?(pair)
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


# self.gift_for_pair || 'No Gift Registered Yet'





  # def my_pair
  #   User.first(pair: self.email)
  # end

  # has 1, :pairing, child_key: [:santee_id]
  # has 1, :santa, through: :pairing, via: :santa
  # has n, :santa, :child_key => [ :source_id ]
  # has n, :santee, self, :through => :friendships, :via => :target
  # belongs_to :user
  #
  # has
  # property :pair_2016, User, format: :email_address, unique: true

  # def paired
  #   all(:pair.not => nil)
  # end

  # def not_registered
  #   registered = all_registered
  #   $andelans.select do |n|
  #     !registered.include?(n) && !$uninterested_fellows.include?(n)
  #   end
  # end

  # def unpaired
  #   all(pair: nil)
  # end



    #
    # def breakpoints
    #   select do |user|
    #     pair = user.pair
    #     pair_user = first(email: pair)
    #     (pair_user && pair_user.pair == user.email)
    #   end
    # end
