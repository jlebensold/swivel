require 'less'
require 'sinatra'

set :public_folder, File.dirname(__FILE__) + '/public'
get '/test' do
	erb :test
end


get '/' do
	erb :index
end

get '/bootstrap/application.css' do
	content_type 'text/css', :charset => 'utf-8'
	parser = Less::Parser.new :paths => ['./views/bootstrap'], :filename => 'bootstrap.less'
	tree = parser.parse(IO.readlines("./views/bootstrap.less").join("\r\n")) # => Less::Tree
tree.to_css
end
