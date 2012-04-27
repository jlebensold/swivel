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
		_.bindAll(this,'render','rowsAndColumns','sortTiles','removeTile','addTile','createVis','loadData','resizeCurrentTiles','tileClicked','animate', 'bucketize','loadGridData','loadBucketData','redrawBucketBoundaries');
		this.collection = new TileCollection();
		if (this.options.collection != undefined) {
			_.each(this.options.collection,function(t) {
				this.collection.add(t);
			},this);
		}
		this.w = 450;
		this.h = 460;
		this.x = d3.scale.linear().range([0, this.w]),
		this.y = d3.scale.linear().range([this.h, 0]),
		this.vis = null;
		this.data = [];
   	this.margin = 0.7;
		this.collection.bind('add',this.addTile);
		this.collection.bind('reset',this.sortTiles);
    this.tileTemplate = this.options.tileTemplate;
		this.tileSize = 0;
		this.render();

		this.animationDuration = 1200;
	},

	rowsAndColumns: function(numberOfBuckets, maxBucketSize) {
				var zoom = 1;
 				var margin = this.margin;
        var p = zoom * (maxBucketSize - Math.pow(margin, 2));
        var q = (this.h + ((this.w / numberOfBuckets) * zoom)) * margin;
        var r = -1 * (this.h * (this.w / numberOfBuckets));
				
        this.tileSize = ((-1 * q) + Math.sqrt(Math.pow(q, 2) - (4 * p * r))) / (2 * p);
				//TODO this is too conservative
        return {
            rows:  Math.floor(this.h / this.tileSize * zoom),
            columns:  Math.floor((this.w / numberOfBuckets) / this.tileSize),
            tileSize: Math.floor(this.tileSize),
						width: (this.w / numberOfBuckets)
        }
  },

	addTile: function() {
		this.bucketize(this.collection.bucketing);
		this.createVis();
	},

	sortTiles: function() {
		this.loadData();
	},

	removeTile: function() {
		this.loadData();
	},

	resizeCurrentTiles: function() {
    this.vis.selectAll(".tiles")
        .data(this.data, function(d) {return d.cid})
        .attr("transform",function(d) {return "translate("+(d.x+d.h)+","+(d.y+d.w)+")scale(-1,-1)";});
	},

	bucketize: function(bucketing) {

		this.collection.bucketing = bucketing;
		this.buckets = this.collection.getBuckets();
    this.loadData();
    this.redrawBucketBoundaries();
	},

	loadData: function() {
			if (!this.collection.isBucketing())
				this.loadGridData();
			else
        this.loadBucketData();
	},
  loadBucketData: function() { 
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
			

		this.data = this.collection.active().map(function(t,iterator) {
				var bucketing = t.get(this.collection.bucketing);
				var perBucketIterator = this.buckets[bucketing].iterator++;

				var col = perBucketIterator % rc.columns;
				if (rc.columns == 0)
				{
					this.buckets[bucketing].lastCol = 1;
					col = 0
				}
				//single column edge case
				if (rc.columns == 1 )
				{
					this.buckets[bucketing].row = perBucketIterator; 
				}
				else if (this.buckets[bucketing].lastCol > col)
				{
					this.buckets[bucketing].row++;
				}
				this.buckets[bucketing].lastCol = col;
				var offset = this.buckets[bucketing].position * rc.width;
        var padding = 5;
				return { 
								 h: rc.tileSize, 
								 w: rc.tileSize, 
								 x: offset + (col * (rc.tileSize + .5*(rc.tileSize * ((1 - this.margin) / 4)))) + padding, 
								 y: (this.buckets[bucketing].row ) * (rc.tileSize + .5*(rc.tileSize * ((1 - this.margin) / 4))) + padding,
								 row: this.buckets[bucketing].row,
								 col: col,
								 model: t,
								 cid: t.cid
							 };

		},this);
  },

	loadGridData: function() {
			var rc = this.rowsAndColumns(1, this.collection.active().length);
			var row = 0;
			var lastCol = 0;
			this.data = this.collection.active().map(function(t,iterator) { 
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
      .attr("height", this.h+30) // give room for the bucket names
			.attr("border","1")
	   .append("g")
     	.attr("transform", "translate(" + ((this.w)) + "," + ((this.h)) + ") scale(-1,-1)")
     	.attr("width", this.w)
     	.attr("height", this.h);
    
    var self = this;
    $(this.el).delegate("image",'click',function(k) {
      k.preventDefault();
      self.trigger('tileClicked',k.target.__data__.model);
    });
		this.loadData();
		this.createVis();
		this.animate();
    return this;
	},

  animate: function() {
     this.redrawBucketBoundaries();
     var animation = this.vis.selectAll(".tiles")
      .data(this.data, function(d) {return d.cid})
		  .transition().duration(this.animationDuration);

		 animation.attr("transform",function(d) {return "translate("+(d.x+d.h)+","+(d.y+d.w)+")scale(-1,-1)";});

		 this.vis.selectAll("rect")
      .data(this.data, function(d) {return d.cid})
				.attr("height", function(d) { return d.h; } )
				.attr("width", function(d) { return d.w; } );

		 this.vis.selectAll("image")
      .data(this.data, function(d) {return d.cid})
				.attr("height", function(d) { return d.h; } )
				.attr("width", function(d) { return d.w; } );

		this.vis.selectAll(".tiles").data(this.data, function(d) { return d.cid;}).exit()
		  .transition().duration(this.animationDuration)
      .attr("transform",function(d) {
        var x = (0.5 - Math.random())*10000;
        var y =  (0.5 - Math.random())*10000;
        return "translate("+x+","+y+")"})
      .remove();
  },

  redrawBucketBoundaries: function() {
    var data = this.collection.getBucketData(this.h,this.w);
    var vis = d3.select(this.el).select("svg");
    vis.selectAll(".bucketcontainer").remove();
    vis.selectAll(".buckettext").remove();
    if (!this.collection.isBucketing()) return;
    vis.selectAll(".buckettext").remove();
    var bucket = vis.selectAll(".bucketcontainer").data(data);
      bucket.enter()
      .insert("rect",":first-child")
      .attr("class","bucketcontainer")
      .attr("x", function(d) { return d.x; } )
      .attr("rx", 5)
      .attr("ry", 5)
      .attr("y", function(d) { return d.y; } )
      .attr("height", function(d) { return d.h; } )
      .attr("width", function(d) { return d.w; } );
  
    bucket.enter()
      .append("text")
        .text(function(d) { return d.txt; })
        .attr("class","buckettext")
        .attr("x", function(d) { return d.x + d.w / 2; } )
        .attr("y", function(d) { return d.h + d.y - 4; } );

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
			.attr("id",function(d) { return d.cid })
      .attr("height", function(d) { return d.h; } )
      .attr("width", function(d) { return d.w; } )
      .attr("fill", function(d) { return 'black'; });



    if (this.tileTemplate) this.tileTemplate(rects);


    var self = this;
    this.vis.selectAll("rect").on("click",function(d) {
    });
	},

	tileClicked: function(d) {
		this.trigger('tileClick',d);
	}
});
