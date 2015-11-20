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

    ande = CSV.open('andelans.csv').to_a.flatten
    $andelans = []
    ande.each{ |n|
      if n
        n = n.strip
        $andelans << n if n.match(/.*@andela.com$/)
      end
    }

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
  erb :welcome
end

get '/view_pair' do
  return redirect '/' unless current_user
  @title = "View Pair"
  @show_pair = true
  erb :get_pair
end

post '/get_pair' do
  user_id = params[:uuser]
  user = User.first(google_auth_id: user_id);
  return redirect '/' unless user
  user.generate_pair
end

get '/login' do
  erb :welcome
end

get '/home' do
  return redirect '/login' unless current_user
  @title = "Home"
  erb :get_pair
end

get '/auth/:name/callback' do
  @auth = request.env['omniauth.auth']
  @user = User.first_or_create(email: @auth.info.email, google_auth_id: @auth.uid)
  unless @user.valid?
    return redirect '/', error: "Please use an official Andela Email Address: (*@andela.com).\nIf you still encounter this error afterwards,\nPlease contact the Lagos' People Intern"
  end
  session[:user_id] = @user.id
  redirect '/home'
end

get '/logout' do
  session.clear
  redirect '/'
end

get '/dashboard' do
  @all_unpaired = User.unpaired
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
end
