require 'dotenv'
Dotenv.load
require 'bundler/setup'
Bundler.require

require 'sinatra/flash'
require 'sinatra/redirect_with_flash'
require 'omniauth-oauth2'
require 'omniauth-google-oauth2'
require 'pry'
require 'pathname'
require 'csv'

set :bind, '0.0.0.0'

$andela_mail = /.*@andela.com$/

Object.class_eval do
  def blank?
    respond_to?(:empty?) ? !!empty? : !self
  end
end

String.class_eval do
  def name_from_email
    self.match(/(.*)@andela.com$/)
    name = $1
    name.split('.').map{|n| n.capitalize }.join(' ') if name
  end
end

    ande = CSV.open('andelans.csv').to_a.flatten
    gifts = CSV.open('santa_responses.csv', headers: true)
    $user_gifts = {}
    gifts.each{ |user|
      user_name = user['Username']
      next if user_name.blank?
      user_name = user_name.strip
      gift =  user["What gifts would you like? Put in your wishlist! Three options only, please!"]
      $user_gifts[user_name] = gift
    }

    $andelans = LazyArray.new
    ande.each{ |n|
      if n
        n = n.strip
        $andelans << n if n.match($andela_mail)
      end
    }

    uninterested_fellows = CSV.open('uninterested.csv').to_a.flatten.select! do |f|
      f && f.match($andela_mail)
    end

    $uninterested_fellows = uninterested_fellows || []

APP_ROOT = Pathname.new(File.expand_path('../', __FILE__))

DataMapper.setup(:default, ENV['DATABASE_URL'] || "sqlite3://#{Dir.pwd}/development.db")

Dir[APP_ROOT.join('models', '*.rb')].each { |file| require file }

DataMapper.finalize
DataMapper.auto_upgrade!

use OmniAuth::Builder do
  provider :google_oauth2, ENV["GOOGLE_CLIENT_ID"], ENV["GOOGLE_CLIENT_SECRET"]
end

use Rack::Session::Cookie, secret: 'abcdefg'
enable :sessions

get '/' do
  return redirect '/home' if current_user
  @title = "Welcome"
  erb :login
end

get '/view_pair' do
  return redirect '/' unless current_user
  @title = "View Pair"
  @show_pair = true
  erb :view_pair
end

post '/get_pair' do
  user_id = params[:uuser]
  user = User.first(google_auth_id: user_id)
  return redirect '/' unless user
  user.generate_pair
end

get '/login' do
  erb :login
end

get '/home' do
  return redirect '/login' unless current_user
  @title = "Home"
  erb :view_pair
end

get '/auth/:name/callback' do
  @auth = request.env['omniauth.auth']
  @user = User.first_or_create(email: @auth.info.email, google_auth_id: @auth.uid)
  unless @user.valid?
    return redirect '/', error: "Please use an official Andela Email Address: (*@andela.com)."
  end
  session[:user_id] = @user.id
  redirect '/home'
end

get '/logout' do
  session.clear
  redirect '/'
end

get '/dashboard' do
  return redirect '/', error: "You are not authorized to visit this route" unless(current_user && (authorized_users.include? current_user.email ))
  @registered_but_unpaired = User.unpaired
  @not_registered = User.not_registered
  @registered = User.all_registered
  @registered_and_paired = User.paired
  @recs = [@registered_but_unpaired.size, @not_registered.size, @registered.size, @registered_and_paired.size].max
  erb :dashboard, layout: :admin
end

get '/all_pairs' do
  return redirect '/', error: "You are not authorized to visit this route" unless(current_user && (authorized_users.include? current_user.email))
  @users = User.paired
  erb :all_pairs, layout: :admin
end

helpers do
    def nl2br(string)
     if string
       string.gsub("\n\r","<br />").gsub("\r", "").gsub("\n", "<br />")
     end
   end

  def current_user
    @user = User.get(session[:user_id]) if session[:user_id]
  end

  def authorized_users
    %w(akonam.ikpelue@andela.com helen.eboagwu@andela.com gbenga@andela.com sayo.alagbe@andela.com oreoluwa.akinniranye@andela.com)
  end
end
