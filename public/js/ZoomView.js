window.ZoomView = Backbone.View.extend({
	initialize: function() {
		this.collection = new TileCollection();
		this.zoom = 4;
		this.w = 450;
		this.h = 460;
		this.x = d3.scale.linear().range([0, this.w]),
		this.y = d3.scale.linear().range([this.h, 0]),
		this.vis = null;

		_.bindAll(this,'render','zoomLevel','zoomIn','zoomOut','renderTiles');
	},
	render: function() {
		var p = 2;
		this.vis = d3.select(this.el)
			.append("svg")
				.attr("width", this.w * 2)
				.attr("height", this.h * 2)
		  .append("g")
    		.attr("transform", "translate(" + p + "," + p + ")");

		this.vis.append("rect")
			.attr("class","rect")
			.attr("width", this.w)
			.attr("height", this.h);

	  this.renderTiles();
		
	},

	renderTiles: function(t) {
		symbol = d3.scale.ordinal().range(d3.svg.symbolTypes);
		var x = this.x;
		var y = this.x;
	
		this.vis.data(this.collection.toJSON())
			.append("rect")
				.attr("class", "tile")
				.attr("height",300)
				.attr("width",100)
				.text("sd")
			.transition()
        .duration(750)
        .attr("x", 100)
        .style("stroke-opacity", 1);
	 
    this.collection.each(function(tile) {
      this.vis.append("text")
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .text(tile.get("meta").title);
    },this);

		
		this.vis.selectAll("text").transition()
			.duration(800)
			.attr("x",100)
			.attr("y",100);
			
		
	},

	zoomLevel: function() {
		return this.zoom;
	},

	zoomIn: function() {
		if(this.zoom < 9)
			this.zoom++;
	},

	zoomOut: function() {
		if (this.zoom >= 0)
			this.zoom--;
	}

});
