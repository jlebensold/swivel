set :public_folder, File.dirname(__FILE__) + '/public'
get '/test' do
	erb :test
end


get '/q/:term' do
  content_type :json
  key = config = YAML.load_file("#{File.dirname(__FILE__)}/config.yml")['key']
  options = {
    :format => "json",
    :showFields => "shortUrl,score,thumbnail",
    :q => params[:term],
    :apiKey => key,
    :pageSize => 50,
    :orderBy => "relevance"
  }
  out = JSON.parse(HTTParty.get("http://content.guardianapis.com/search", :query => options).body)["response"]["results"]
  out.concat(JSON.parse(HTTParty.get("http://content.guardianapis.com/search",:query => options.merge({:page=>2})).body)["response"]["results"])
  out.concat(JSON.parse(HTTParty.get("http://content.guardianapis.com/search",:query => options.merge({:page=>3})).body)["response"]["results"])
  out.to_json()
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
