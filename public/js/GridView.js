window.GridView = Backbone.View.extend({
	initialize: function() {
		_.bindAll(this,'render','rowsAndColumns','sortTiles','removeTile','addTile','updateVis','loadData','resizeCurrentTiles','tileClicked');
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
	resizeCurrentTiles: function() {
	var rc = this.rowsAndColumns();
	this.vis.selectAll(".rect")
      .data(this.data)
			.transition().duration(1000)
			.attr("height",rc.tileSize)
			.attr("width",rc.tileSize)
  		.attr("x", function(d) { return d.x; } )
      .attr("y", function(d) { return d.y; } );

	this.vis.selectAll(".tile-group text")
			.data(this.data)
			.transition().duration(900)
  		.attr("x", function(d) { return d.x + d.w / 2; } )
      .attr("y", function(d) { return d.y + d.h / 2; } );

	},
	sortTiles: function() {
		this.vis.sort(function(a,b){ return [a.model.get('meta').description,b.model.get('meta').description].sort();  });
		this.loadData();
		this.resizeCurrentTiles();
		this.updateVis();
	},

	removeTile: function(t) {
		this.loadData();
		this.resizeCurrentTiles();
		this.updateVis();
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

	updateVis: function(){
		var enter = this.vis.selectAll(".rect")
      .data(this.data)
   		.enter().append("g").attr("class","tile-group");
		var self = this;
	
		enter.append("rect")
      .attr("class", "rect")
      .attr("height", function(d) { return d.h ; } )
      .attr("width", function(d) { return d.w; } )
      .attr("x", function(d) { return (0.5 - Math.random())*1000; } )
      .attr("y", function(d) { return (0.5 - Math.random())*1000; } )
		.transition().duration(700)
      .attr("x", function(d) { return d.x; } )
      .attr("y", function(d) { return d.y; } );


		enter.append("text")
			.text(function(d) { return d.model.get('meta').title; })
      .attr("x", function(d) { return (0.5 - Math.random())*10000; } )
      .attr("y", function(d) { return (0.5 - Math.random())*10000; } )
		.transition().duration(700)
      .attr("x", function(d) { return d.x + d.w / 2; } )
      .attr("y", function(d) { return d.y + d.h / 2; } );
		
			
		this.vis.selectAll(".rect").data(this.data).exit()
			.transition().duration(700)
	    .attr("x", function(d) { return (0.5 - Math.random())*10000; } )
      .attr("y", function(d) { return (0.5 - Math.random())*10000; } );

		 this.vis.selectAll("rect").on("click",function(d) {
				self.tileClicked(d.model);
			});
	},

	tileClicked: function(d) {
		this.trigger('tileClick',d);
	}
});
