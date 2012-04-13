describe("Adapter", function() {
  var data = "";
  var fields = "";

  beforeEach(function() {
    data = fixtures.sample_response.response.results;
    fields = [
      ['thumbnail', function(item) {return item.fields.thumbnail;} ],
      ['shortUrl', function(item) { return item.fields.shortUrl;} ],
      ['score', function(item) { return item.fields.score; }],
      ['webPublicationDate', 'webPublicationDate'],
      ['webTitle','webTitle'],
      ['tags',function(item) { return _.map(item.tags,function(t) { return t.sectionName;})}]
    ];
  });

  it('should be awesome', function() {

    var adapter = new Adapter({fields:fields, data:data});

    var translated = adapter.transform();


    expect(translated[0].thumbnail).toEqual("http://static.guim.co.uk/sys-images/Media/Columnists/Columnists/2011/10/4/1317734975988/Apple-store-in-Beijing-003.jpg");
  });
});
