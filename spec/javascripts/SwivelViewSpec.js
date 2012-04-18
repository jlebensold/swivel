describe("SwivelView",function() {
	var data;
	var fields;
	beforeEach(function() {
		$("#testbed").remove();
		$("body").append("<div id='testbed'></div>");

  data = fixtures.sample_response.response.results;
  fields = [
      ['thumbnail', function(item) {return item.fields.thumbnail;}],
      ['shortUrl', function(item) { return item.fields.shortUrl;}],
      ['score', function(item) { return item.fields.score; }, 'numberrange'],
      ['webpublicationdate', 'webPublicationDate','daterange'],
      ['webTitle','webTitle'],
      ['tags',function(item) { return _.compact(_.uniq(_.map(item.tags,function(t) { return t.sectionName;})))},'collection']
    ];



	});

	it("should render with guardian data",function() {
		window.swivel = new SwivelView({adapter:{data:data,fields:fields}});
		$("#testbed").html(swivel.render().el);
	});


});
