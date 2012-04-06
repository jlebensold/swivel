window.AppView = Backbone.View.extend({
	events: {

	},
	initialize: function() {
		_.bindAll(this,'render','setTree');
	},
	container: function() {
		return "<div style='margin: 0 auto;position:relative;width:900px;height:500px;padding:0' id='cvs'>"+
			"<canvas style='position: absolute;left:0;top:0;margin:0;padding:0;' width='900' height='500'></canvas>"+
			"</div>"; 
	},
	render: function() {
    $(this.el).html(this.container());
		var v = new GraphView({model:this.model,el:$("#cvs") });
		v.drawColumns();
	},
	setTree: function(tree) {
	 	var nodes = _.map(tree.nodes,function(k) { return new Node(k); },this);
		var branches = _.map(tree.branches, function(k){ return new Branch(k); },this);
		this.model = nodes[0].linkByKey(branches,nodes);
	}

});




