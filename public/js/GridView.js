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
		_.bindAll(this,'render','rowsAndColumns','sortTiles','removeTile','addTile','createVis','loadData','resizeCurrentTiles','tileClicked','animate', 'facetize','loadDataEasy');
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
    this.tileTemplate = this.options.tileTemplate;
		this.render();

		this.animationDuration = 1200;
	},

	rowsAndColumns: function(numberOfBuckets, maxBucketSize) {
				var zoom = 1;
 				var margin = this.margin;
        var p = zoom * (maxBucketSize - Math.pow(margin, 2));
        var q = (this.h + ((this.w / numberOfBuckets) * zoom)) * margin;
        var r = -1 * (this.h * (this.w / numberOfBuckets));

        var tileSize = ((-1 * q) + Math.sqrt(Math.pow(q, 2) - (4 * p * r))) / (2 * p);
				//TODO this is too conservative
        return {
            rows:  Math.floor(this.h / tileSize * zoom),
            columns:  Math.floor((this.w / numberOfBuckets) / tileSize),
            tileSize: Math.floor(tileSize),
						width: (this.w / numberOfBuckets)
        }
  },

	addTile: function() {
		this.facetize(this.collection.facet);
		this.createVis();
   	this.animate();
	},

	sortTiles: function() {
		this.loadData();
		this.animate();
	},

	removeTile: function(t) {
		this.loadData();
		this.resizeCurrentTiles();
		this.createVis();
	},

	resizeCurrentTiles: function() {
    this.vis.selectAll(".tiles")
        .data(this.data, function(d) {return d.cid})
        .attr("transform",function(d) {return "translate("+(d.x+d.h)+","+(d.y+d.w)+")scale(-1,-1)";});

    this.vis.selectAll("rect")
      .data(this.data, function(d) {return d.cid})
      .attr("height", function(d) { return d.h; } )
      .attr("width", function(d) { return d.w; } )
	},

	facetize: function(facet) {
		this.collection.facet = facet;
		this.buckets = this.collection.reduce(function(memo, item) {
			memo[item.get(facet)] = memo[item.get(facet)] || { 
				position:Object.keys(memo).length, 
				count: 0
			}
			memo[item.get(facet)].count += 1;
			return memo;
		}, {},this);
		this.loadData();

		//TODO: move this out

	},

	loadData: function() {
			if (this.collection.facet.length == 0) {
				this.loadDataEasy();
			}
			else	{
				_.each(this.buckets,function(k) {
			k.col = 0;
			k.row = 0;
			k.lastCol = 0;
			k.iterator =  0;

				});



				var maxBucketSize = _.max(this.buckets, function(item) {return item.count;} );
				
				var numBuckets = Object.keys(this.buckets).length;
				// split into the number of lists we have for buckets
				var rc = this.rowsAndColumns(numBuckets,maxBucketSize.count);
				

			this.data = this.collection.map(function(t,iterator) {
					var facet = t.get(this.collection.facet);
					var perBucketIterator = this.buckets[facet].iterator++;

					var col = perBucketIterator % rc.columns;
					if (rc.columns == 0)
					{
						this.buckets[facet].lastCol = 1;
						col = 0
					}
					//single column edge case
					if (rc.columns == 1 )
					{
						this.buckets[facet].row = perBucketIterator; 
					}
					else if (this.buckets[facet].lastCol > col)
					{
						this.buckets[facet].row++;
					}
					this.buckets[facet].lastCol = col;
					var offset = this.buckets[facet].position * rc.width;
					return { 
									 h: rc.tileSize, 
									 w: rc.tileSize, 
									 x: offset + (col * (rc.tileSize + .5*(rc.tileSize * ((1 - this.margin) / 4)))), 
									 y: (this.buckets[facet].row ) * (rc.tileSize + .5*(rc.tileSize * ((1 - this.margin) / 4))),
									 row: this.buckets[facet].row,
									 col: col,
									 model: t,
									 cid: t.cid
								 };

			},this);

			}

	},

	loadDataEasy: function() {
			var rc = this.rowsAndColumns(1, this.collection.length);
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
     	.attr("transform", "translate(" + ((this.w)) + "," + ((this.h)) + ") scale(-1,-1)")
     	.attr("width", this.w)
     	.attr("height", this.h);
		this.loadData();
		this.createVis();
		this.animate();
    return this;
	},

  animate: function() {
     this.vis.selectAll(".tiles")
      .data(this.data, function(d) {return d.cid})
      .transition().duration(this.animationDuration)
        .attr("transform",function(d) {return "translate("+(d.x+d.h)+","+(d.y+d.w)+")scale(-1,-1)";});
		 this.vis.selectAll("rect")
      .data(this.data, function(d) {return d.cid})
      .transition().duration(this.animationDuration)
				.attr("height", function(d) { return d.h; } )
				.attr("width", function(d) { return d.w; } );
  },

	createVis: function(){

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
      .attr("fill", function(d) { return d.model.get("color") });


    if (this.tileTemplate) this.tileTemplate(rects);

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
