window.GridView = Backbone.View.extend({
	initialize: function() {
		_.bindAll(this,'render','rowsAndColumns');
		this.collection = new TileCollection();
		this.w = 450;
		this.h = 460;
		this.x = d3.scale.linear().range([0, this.w]),
		this.y = d3.scale.linear().range([this.h, 0]),
		this.vis = null;
   	this.margin = 0.7;
		this.collection.bind('add',this.render);
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
	render: function() {
		$(this.el).empty();
		var rc = gv.rowsAndColumns();
		var row = 0;
		var lastCol = 0;
		var data = gv.collection.map(function(t,iterator) { 
				var col = iterator % rc.columns;
				if (lastCol > col)
				{
					row++;
				}
				lastCol = col;

				return { 
								 h: rc.tileSize, 
								 w: rc.tileSize, 
								 x: col * (rc.tileSize + 0*(rc.tileSize * ((1 - gv.margin) / 4))), 
								 y: row * (rc.tileSize + 0*(rc.tileSize * ((1 - gv.margin) / 4)))
							 };

		});

		var svg = d3.select(this.el).append("svg")
      .attr("width", gv.w+4)
      .attr("height", gv.h+4)
			.attr("border","1")
	   .append("g")
     	.attr("transform", "translate(" + 2 + "," + 2 + ")")
     	.attr("width", gv.w)
     	.attr("height", gv.h); 
		svg.selectAll(".rect")
      .data(data)
    .enter().append("rect")
      .attr("class", "rect")
      .attr("x", function(d) { return d.x; } )
      .attr("y", function(d) { return d.y; } )
      .attr("height", function(d) { return d.h ; } )
      .attr("width", function(d) { return d.w; } );
		return this;
	}
});
