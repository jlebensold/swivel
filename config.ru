require 'rubygems'
require 'bundler'
Bundler.require

require './app.rb'

set :environment, :development
set :run, false

run Sinatra::Application
