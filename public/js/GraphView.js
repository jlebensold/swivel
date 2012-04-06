window.GraphView = Backbone.View.extend({
	initialize: function() {
		_.bindAll(this,'render','columns','drawColumns','drawNode','drawBranches','canvasContext');
	},
	
	render: function() {

	},
	
	columns: function() {
		return this.model.treeDepth();
	},
	canvasContext: function() {
		return $(this.el).find('canvas').get(0).getContext('2d');
	},

	drawColumns: function() {
		var c = this.columns();
		var width = Math.floor($(this.el).width() / c);
		$(this.el).append("<div class='columns'></div>");
		for(var i = 0; i < c; i++) {
			$(this.el).find('.columns').append("<div class='col_"+(i+1)+"' style='float:left;width:"+(width-8)+"px;height:500px;padding:0px;'></div>");
		}

		this.drawNode(this.model);
	},

	drawNode: function(node) {
		$(this.el).find(".col_"+node.depth()).append("<div id='"+node.cid+"' class='node "+node.get('type')+"' >"+node.get('type')+"</div>");
		this.drawBranches(node.get('branches'));
	},

	drawBranches: function(branches) {
		var ctx = this.canvasContext();

		branches.each(function(b) {
			if (b.get('node') == null)
		{
			return;
		}
			this.drawNode(b.get('node'));

			// get node dimensions:
			var bn = $("#"+b.get('backnode').cid);
			var nodeDim = {
				w:bn.width(),
				h:bn.height(),
				col:b.get('backnode').depth()
			};
			var c = this.columns();
			var colWidth = Math.floor($(this.el).width() / c);

			src = { left: 0 + ( (nodeDim.col - 1) * (colWidth)),
							top: nodeDim.h / 2 };
			dst = { left: (nodeDim.col * colWidth),
							top: nodeDim.h / 2 + (branches.indexOf(b) * nodeDim.h)};

			src.left = src.left + nodeDim.w - 10;
			dst.left = dst.left - 10;

			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.moveTo(src.left,src.top);
			ctx.lineTo(dst.left,dst.top);
			ctx.stroke();
			
			var l =  (dst.left - src.left + nodeDim.w * 2) * (b.get('backnode').depth()- .9);
			ctx.fillText(b.get('txt'),l, (src.top + dst.top / 2)+5);


		},this);
	}
});
