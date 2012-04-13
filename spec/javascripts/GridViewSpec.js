window.BWC = {
  zeroPad: function (value, options) {
    options || (options = {});
    var length = options.length || 10;
    var zeros = "";
    if (!value) value = "";
    for (var i = 0; i < length - (value.toString()).length; i++) zeros = zeros + "0";
    return zeros + value;
  }
}

describe("GridView", function() {
	beforeEach(function() {
		$("#testbed").remove();
		$("body").append("<div id='testbed'></div>");
		window.gv = new GridView({el: $("#testbed")});
	});

	it("should be able to calculate how many rows and columns are required for the tile collection",function() {
		gv.h = 100;
		gv.w = 125;
		_.each(d3.range(0,9),function(i) {
			gv.collection.add({meta:{title:"A"+i}});
		},this);

		var r = gv.rowsAndColumns(1, gv.collection.length);
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



	it("should trigger an event when a tile is clicked",function() {
			gv = new GridView();
		_.each(d3.range(0,7),function(i) {
			gv.collection.add({meta:{title:"A"+i}});
		},this);

		$("#testbed").html(gv.render().el);
		gv.bind('tileClick',function(d) {
			$("#testbed").append("<div><pre>"+ JSON.stringify(d.toJSON())+"</pre></div>");
		});
		gv.trigger('tileClick',gv.collection.first());
		expect($("#testbed pre").html()).toEqual('{"meta":{"title":"A0"},"template":""}');

	});

	it("should be able to sort against a particular facet",function() {
			gv = new GridView();
		_.each(d3.range(0,10),function(i) {
			gv.collection.add({meta:{title:"A"+i, description: parseInt(Math.floor(Math.random() * 1000))+ "B"}});
		},this);
		$("#testbed").html(gv.render().el);
		console.log(gv.collection.first().get('meta').description);
		gv.collection.comparator = function(t) {
			return window.BWC.zeroPad(t.get("meta").description);
		};

		setTimeout(function() {
      gv.collection.sort();
    },2800);
	});
});
