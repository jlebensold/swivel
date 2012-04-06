require 'rubygems'
require './app.rb'

set :environment, :development
set :run, false

run Sinatra::Application
