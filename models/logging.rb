class Logging
  include DataMapper::Resource

  property :id, Serial
  property :google_auth_id, String
  property :email, String, required: true
end
