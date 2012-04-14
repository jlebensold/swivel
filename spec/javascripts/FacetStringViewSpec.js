describe("FacetStringView",function() {
	var data,view;
	beforeEach(function() {
		data = {"name":"tags","values":["Technology","Media","World news","Television &amp; radio","Culture","From the Guardian","Music","UK news","Politics","News","Football","Sport","Comment is free","Education","Science","Higher Education Network","Environment","Life and style","Children's books","Books","Business","Film","Art and design","Society","Travel","Stage","From the Observer","Fashion"],"type":"collection"};

		$("#testbed").remove();
		$("body").append("<div id='testbed'></div>");
		view = new FacetStringView();
		
		
	});
	it("should render a list of checkboxes",function() {
		view.setFacetData(data);
		$("#testbed").html(view.render().el);
		expect($("#testbed ul li input").length).toEqual(data.values.length);
	});

	it("should have the facetvalue on load",function() {
		view.setFacetData(data);
		$("#testbed").html(view.render().el);
		expect(view.facetvalue).toEqual(data.values);
	});
});
