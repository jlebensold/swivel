window.BWC = {
  zeroPad: function (value, options) {
    options || (options = {});
    var length = options.length || 10;
    var zeros = "";
    for (var i = 0; i < length - (value.toString()).length; i++) zeros = zeros + "0";
    return zeros + value;
  }
}

window.GridView = Backbone.View.extend({
	initialize: function() {
		_.bindAll(this,'render','rowsAndColumns','sortTiles','removeTile','addTile','updateVis','loadData','resizeCurrentTiles','tileClicked','reorder');
		this.collection = new TileCollection();
		this.w = 450;
		this.h = 460;
		this.x = d3.scale.linear().range([0, this.w]),
		this.y = d3.scale.linear().range([this.h, 0]),
		this.vis = null;
		this.data = [];
   	this.margin = 0.7;
		this.collection.bind('add',this.addTile);
		this.collection.bind('remove',this.removeTile);
		this.collection.bind('reset',this.sortTiles);
		this.render();
	},

	rowsAndColumns: function() {
				var zoom = 1;
 				var margin = this.margin;
        var p = zoom * (this.collection.length - Math.pow(margin, 2));
        var q = (this.h + (this.w * zoom)) * margin;
        var r = -1 * (this.h * this.w);
        var tileSize = ((-1 * q) + Math.sqrt(Math.pow(q, 2) - (4 * p * r))) / (2 * p);
				//TODO this is too conservative
        return {
            rows:  Math.floor(this.h / tileSize * zoom),
            columns:  Math.floor(this.w / tileSize),
            tileSize: Math.floor(tileSize)
        }
  },

	addTile: function() {
		this.loadData();
		this.resizeCurrentTiles();
		this.updateVis();
	},

	sortTiles: function() {
		this.loadData();
		this.reorder();
	},

	removeTile: function(t) {
		this.loadData();
		this.resizeCurrentTiles();
		this.updateVis();
	},

	resizeCurrentTiles: function() {
    this.vis.selectAll(".tiles")
        .data(this.data, function(d) {return d.cid})
        .attr("transform",function(d) {return "translate("+d.x+","+d.y+")";});

    this.vis.selectAll("rect")
      .data(this.data, function(d) {return d.cid})
      .attr("height", function(d) { return d.h; } )
      .attr("width", function(d) { return d.w; } )
	},

	loadData: function() {
			var rc = this.rowsAndColumns();
			var row = 0;
			var lastCol = 0;
			this.data = this.collection.map(function(t,iterator) { 
					var col = iterator % rc.columns;
					if (lastCol > col)
						row++;
					lastCol = col;
					return { 
									 h: rc.tileSize, 
									 w: rc.tileSize, 
									 x: col * (rc.tileSize + .5*(rc.tileSize * ((1 - this.margin) / 4))), 
									 y: row * (rc.tileSize + .5*(rc.tileSize * ((1 - this.margin) / 4))),
									 row: row,
									 col: col,
									 model: t,
									 cid: t.cid
								 };

			},this);
	},

	render: function() {
		$(this.el).empty();

		this.vis = d3.select(this.el).append("svg")
      .attr("width", this.w+4)
      .attr("height", this.h+4)
			.attr("border","1")
	   .append("g")
     	.attr("transform", "translate(" + 2 + "," + 2 + ")")
     	.attr("width", this.w)
     	.attr("height", this.h);
		this.loadData();
		this.updateVis();
    return this;
	},

  reorder: function() {
     this.vis.selectAll(".tiles")
      .data(this.data, function(d) {return d.cid})
      .transition().duration(700)
        .attr("transform",function(d) {return "translate("+d.x+","+d.y+")";});
  },

	updateVis: function(){

		var rects = this.vis.selectAll(".tiles")
      .data(this.data, function(d) {return d.cid})
   		.enter()
      .append("g")
      .attr("class","tiles")
      .attr("transform",function(d) {
        var x = (0.5 - Math.random())*10000;
        var y =  (0.5 - Math.random())*10000;
        return "translate("+x+","+y+")";
      });
	
    rects.append("rect")
      .attr("class", "rect")
      .attr("height", function(d) { return d.h; } )
      .attr("width", function(d) { return d.w; } )

		rects.append("text")
			.text(function(d) { return d.model.get('meta').title; })
			.attr("x", 4)
			.attr("y", 25)

    rects.transition().duration(700)
        .attr("transform",function(d) {return "translate("+d.x+","+d.y+")";});
			
		this.vis.selectAll(".tiles").data(this.data).exit().remove();

    var self = this;
    this.vis.selectAll("rect").on("click",function(d) {
      self.tileClicked(d.model);
    });
	},

	tileClicked: function(d) {
		this.trigger('tileClick',d);
	}
});
