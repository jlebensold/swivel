describe("ZoomView", function() {
	beforeEach(function() {
		$("#testbed").remove();
		$("body").append("<div id='testbed'></div>");
		view = new ZoomView({el: $("#testbed")});
	});
	it("should have zoom levels",function() {
		expect(view.zoomLevel()).toEqual(4);
		view.zoomIn();
		expect(view.zoomLevel()).toEqual(5);
		view.zoomOut();
		view.zoomOut();
		expect(view.zoomLevel()).toEqual(3);
	});


	it("should be able to render tiles",function() {
		var t = new Tile({meta: {title:"hello world"}, template: "<%= title %>" });
		view.collection.add(t);
		view.render();
	});

});
