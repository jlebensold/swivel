describe("GridView", function() {
	beforeEach(function() {
		$("#testbed").remove();
		$("body").append("<div id='testbed'></div>");
//		zv = new ZoomView({el: $("#testbed")});
		window.gv = new GridView({el: $("#testbed")});
	});

	it("should be able to calculate how many rows and columns are required for the tile collection",function() {
		gv.h = 100;
		gv.w = 125;
		_.each(d3.range(0,9),function(i) {
			gv.collection.add({meta:{title:"A"+i}});
		},this);

		var r = gv.rowsAndColumns();
		expect(r.rows).toEqual(3);
		expect(r.columns).toEqual(4);
		expect(r.tileSize).toEqual(30);

	});

	it("should be able to draw rows + columns",function() {
		gv = new GridView();
		_.each(d3.range(0,7),function(i) {
			gv.collection.add({meta:{title:"A"+i}});
		},this);
		
		$("#testbed").html(gv.render().el);
		expect($("body svg rect").length).toEqual(7);
		
		gv.collection.add({meta:{title: "asd"}});

		expect($("body svg rect").length).toEqual(8);
	});

	it("should animate in and out",function() { 
		gv = new GridView();
		_.each(d3.range(0,7),function(i) {
			gv.collection.add({meta:{title:"A"+i}});
		},this);
		
		$("#testbed").html(gv.render().el);
		expect($("body svg rect").length).toEqual(7);
		gv.collection.remove(gv.collection.first());
		setTimeout(function(){
				expect($("body svg rect").length).toEqual(6);
			},1000);
	});

	it("should redraw proportionally when new items enter the gridview", function() {
		gv = new GridView();
		_.each(d3.range(0,7),function(i) {
			gv.collection.add({meta:{title:"A"+i}});
		},this);
		$("#testbed").html(gv.render().el);

		setTimeout(function() {
			_.each(d3.range(0,7),function(i) {
			gv.collection.add({meta:{title:"A"+i}});
			},this);
			setTimeout(function() {
				expect($(gv.vis.select("rect")[0]).attr("height")).toEqual(102);
			},1000);
		},1000);

	});

	it("should draw the template on the card", function() {
			gv = new GridView();
		_.each(d3.range(0,7),function(i) {
			gv.collection.add({meta:{title:"A"+i}});
		},this);
		$("#testbed").html(gv.render().el);
		expect($(gv.vis.select("text")[0]).text()).toEqual("A0");
	});
});
