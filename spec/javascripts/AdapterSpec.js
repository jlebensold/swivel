describe("Adapter", function() {
  var data = "";
  var fields = "";

  beforeEach(function() {
    data = fixtures.sample_response.response.results;
    fields = [
      ['thumbnail', function(item) {return item.fields.thumbnail;}, 'string'],
      ['shortUrl', function(item) { return item.fields.shortUrl;} ,'string'],
      ['score', function(item) { return item.fields.score; }, 'numberrange'],
      ['webPublicationDate', 'webPublicationDate','daterange'],
      ['webTitle','webTitle'],
      ['tags',function(item) { return _.compact(_.uniq(_.map(item.tags,function(t) { return t.sectionName;})))},'collection']
    ];
  });

  it('can parse data with fields', function() {

    var adapter = new Adapter({fields:fields, data:data});
    var translated = adapter.transform();
    expect(translated[0].thumbnail).toEqual("http://static.guim.co.uk/sys-images/Media/Columnists/Columnists/2011/10/4/1317734975988/Apple-store-in-Beijing-003.jpg");
  });

	it('can determine facets from data',function() {
    var adapter = new Adapter({fields:fields, data:data});
		var faceted = adapter.facets();
		expect(faceted.length).toEqual(5);
		expect(faceted[0].type).toEqual('string');
		expect(faceted[1].type).toEqual('string');
		expect(faceted[2].type).toEqual('numberrange');
		expect(faceted[3].type).toEqual('daterange');
		expect(faceted[3].values[0].toString()).toEqual('Sat Apr 07 2012 02:05:03 GMT+0300 (IDT)');
		expect(faceted[3].values[0].getDay()).toEqual(6);
		expect(faceted[4].values.length).toEqual(28);
		console.log(JSON.stringify(faceted[2]));
	});
});
