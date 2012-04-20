describe("ToolbarView",function() {
	var data,view;
	beforeEach(function() {
		$("#testbed").remove();
		$("body").append("<div id='testbed' style='margin: 50px;'></div>");
		view = new ToolbarView();
		
		
	});
	it("should render a toolbar",function() {
		$("#testbed").html(view.render().el);
		expect($("#testbed .btn").length).toEqual(2);
	});
	
	it("should be able to have a list of bucketable options", function() { 
		var bucketable = ["score","date"];
		view = new ToolbarView({bucketable: bucketable});
		$("#testbed").html(view.render().el);
		expect($("#testbed .bucketable select option").length).toEqual(2);
	});

});
