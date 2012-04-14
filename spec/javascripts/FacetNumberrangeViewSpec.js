describe("FacetNumberrangeView",function() {
	var data,view;
	beforeEach(function() {
		data = {"name":"score","values":[0.05835766,3.9583073],"type":"numberrange"};
	
		$("#testbed").remove();
		$("body").append("<div id='testbed'></div>");
		view = new FacetNumberrangeView();
		
		
	});
	it("should render a number range",function() {
		view.setFacetData(data);
		$("#testbed").html(view.render().el);
		expect(view.facetvalue[0]).toEqual(data.values[0]);
		expect($("#testbed input").val()).toEqual('0.05835766 - 3.9583073');
	});
});
