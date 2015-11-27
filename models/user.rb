require 'dm-core'
require 'dm-migrations'
require 'dm-timestamps'
require 'dm-validations'

class User
  include DataMapper::Resource
  # include Andela

  property :id, Serial
	property :google_auth_id, String
	property :email, String, format: lambda{|n| $andelans.include? n } , required: true, unique: true
  property :pair, String, format: :email_address, unique: true

  def generate_racpair
    return self.pair if self.pair
    @pair_delans ||= $andelans.select{|n| n != self.email }
    begin
      pair = @pair_delans.sample
      self.pair = pair
    end while(User.first(pair: pair) || self.email == pair )
    self.save
    self.pair
  end

  def self.paired
    all(:pair.not => nil)
  end

  def self.unpaired
    all(pair: nil)
  end

  # def pair_name
  #   self.pair.match(/(.*)@andela.com/)
  #   name = $1
  #   name.split('.').map{|n| n.capitalize }.join(' ')
  # end

  def self.not_registered
    registered = all_registered
    $andelans.select{ |n|
      !registered.include? n
    }
  end

  def self.all_registered
    collect{|n| n.email }
  end
end
