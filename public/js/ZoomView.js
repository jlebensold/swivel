window.ZoomView = Backbone.View.extend({
	initialize: function() {
		_.bindAll(this,'render','zoomLevel','zoomIn','zoomOut','updateTileSize');
		this.collection = new TileCollection();
		this.zoom = 4;
		this.w = 450;
		this.h = 460;
		this.x = d3.scale.linear().range([0, this.w]),
		this.y = d3.scale.linear().range([this.h, 0]),
		this.vis = null;

    this.tileSize = 450;

    this.collection.bind('add', this.updateTileSize);
	},

  updateTileSize: function() {
    var w = Math.floor(this.w/this.collection.length);
    var h = Math.floor(this.h/this.collection.length);

    if (w > h) this.tileSize =  h;
    else this.tileSize = w;
  },

	render: function() {
		var p = 2;
		this.vis = d3.select(this.el)
			.append("svg")
				.attr("width", this.w * 2)
				.attr("height", this.h * 2)
		  .append("g")
    		.attr("transform", "translate(" + p + "," + p + ")");

    this.collection.each(function(tile) {
      this.vis.append("rect")
        .attr("class","rect")
        .attr("width", this.tileSize)
        .attr("height", this.tileSize);
    },this);

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
