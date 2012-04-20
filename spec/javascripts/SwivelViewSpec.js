describe("SwivelView",function() {
	var data;
	var fields;
	beforeEach(function() {
		$("#testbed").remove();
		$("body").append("<div id='testbed'></div>");

  data = fixtures.sample_response_large.response.results;
  fields = [
      ['thumbnail', function(item) {return item.fields.thumbnail;}],
      ['shortUrl', function(item) { return item.fields.shortUrl;}],
      ['sectionname', function(item) { return item.sectionName;},'collection'],
      ['score', function(item) { return item.fields.score; }, 'numberrange'],
      ['webpublicationdate', 'webPublicationDate','daterange'],
      ['webTitle','webTitle'],
      ['tags',function(item) { return _.compact(_.uniq(_.map(item.tags,function(t) { return t.sectionName;})))},'collection']
    ];



	});

	it("should render with guardian data",function() {
		window.swivel = new SwivelView({adapter:{data:data,fields:fields},bucketable:["score","tags","webpublicationdate",'sectionname']});
		$("#testbed").html(swivel.render().el);
		expect($("#testbed svg image").length).toEqual(150);
	});

	it("should render with small guardian data",function() {
		window.swivel = new SwivelView({adapter:{data:[
        data[0],
        data[1],
        data[2],
        data[3],
        data[4],
        data[5],
      ],fields:fields},bucketable:["score","tags","webpublicationdate"]});

		$("#testbed").html(swivel.render().el);
		setTimeout(function() {
			swivel.gv.collection.first().set('active',false);
			swivel.gv.removeTile();
			expect($("#testbed svg image").length).toEqual(5);
		},2000);
	});


});
