#!/usr/bin/env rackup

require 'sinatra'
require 'sinatra/reloader'
require './app'

run Sinatra::Application
