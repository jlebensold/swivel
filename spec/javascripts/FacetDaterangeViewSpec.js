describe("FacetDaterangeView",function() {
	var data,view;
	beforeEach(function() {
		data = {"name":"webPublicationDate","values":["2012-04-06","2012-04-13"],"type":"daterange"} 
	
		$("#testbed").remove();
		$("body").append("<div id='testbed'></div>");
		view = new FacetDaterangeView();
		
		
	});
	it("should render a date range",function() {
		view.setFacetData(data);
		$("#testbed").html(view.render().el);
		expect(new Date(view.facetvalue[0]).format('dd')).toEqual('06');
	});

	it("should correctly compare dates",function() {
		d = new Date('April 8, 2012');

		view.setFacetData(data);
		$("#testbed").html(view.render().el);
		expect(new Date(view.facetvalue[0]).format('dd')).toEqual('06');
		expect(view.contains(d)).toBeTruthy();
	});
});

