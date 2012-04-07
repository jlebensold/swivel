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
		_.each(d3.range(0,9),function(i) {
			gv.collection.add({meta:{title:"A"+i}});
		},this);
		
		$("#testbed").html(gv.render().el);
//		expect($("body svg rect").length).toEqual(7);
		
//		gv.collection.add({meta:{title: "asd"}});

//		expect($("body svg rect").length).toEqual(8);
	});
/*
  describe("Height larger than width", function() {
    it("should be able to figure out tile size",function() {
      gv.collection.add({meta: {title:"hello world"}, template: "<%= title %>" });
      expect(gv.tileSize).toEqual(450);
      gv.collection.add({meta: {title:"hello world"}, template: "<%= title %>" });
      expect(gv.tileSize).toEqual(Math.floor(450/2));
    });
  });

  describe("Width larger than height", function() {
    it("should be able to figure out tile size",function() {
      gv.h = 100;
      gv.collection.add({meta: {title:"hello world"}, template: "<%= title %>" });
      expect(gv.tileSize).toEqual(100);
      gv.collection.add({meta: {title:"hello world"}, template: "<%= title %>" });
      expect(gv.tileSize).toEqual(Math.floor(100/2));
    });
	});
*/
});
