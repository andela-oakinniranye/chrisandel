require 'dm-core'
require 'dm-migrations'
require 'dm-timestamps'
require 'dm-validations'

class User
  include DataMapper::Resource

  property :id, Serial
	property :google_auth_id, String
	property :email, String, format: lambda{|n| $andelans.include? n } , required: true, unique: true
  property :pair, String, format: :email_address, unique: true

  def generate_pair
    return self.pair if self.pair
    @pair_delans ||= $andelans.select{|n| n != self.email }
    begin
      pair = @pair_delans.sample
      pair_user = User.first(email: pair)

      self.pair = pair
    end while(User.first(pair: pair) || self.email == pair || (pair_user && pair_user.pair == self.email) )
    self.save
    self.pair
  end

  def self.paired
    all(:pair.not => nil)
  end

  def self.unpaired
    all(pair: nil)
  end

  def self.not_registered
    registered = all_registered
    $andelans.select{ |n|
      !registered.include? n
    }
  end

  def self.all_registered
    collect{|n| n.email }
  end

  def self.breakpoints
    select{ |user|
      pair = user.pair
      pair_user = first(email: pair)
      (pair_user && pair_user.pair == user.email)
    }
  end
end
