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
		expect(new Date(view.facetvalue[0]).getDay()).toEqual(5);
	});
});

