class User
  include DataMapper::Resource

  property :id, Serial
  property :google_auth_id, String
  property :email, String, format: ->(n) { $andelans.include? n }, required: true, unique: true
  property :pair, String, format: :email_address, unique: true

  def generate_pair
    return pair if pair
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
    $user_gifts[pair] || 'No Gift Registered Yet'
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
        f.puts paired_with.collect(&:email)
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
  end
end
