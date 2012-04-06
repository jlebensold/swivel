window.Branch = Backbone.Model.extend({
	defaults: function() {
		return {
		backnode: null,
		node: null,
		txt: "",
		key: ""
		};
	},
	
	initialize: function() {

	},

	asJSON:	function() {
		return {
			node: (this.get('node') != null) ? this.get('node').asJSON() : null,
			txt:	this.get('txt')
		};
	},

	addNode: function(n) {
		this.set('node',new Node(n));
		this.get('node').set('backbranch',this);
	},

	linkByKey: function(branches, nodes) {
		_.each(nodes,function(n) {
			var r = _.find(n.get('inc'),function(branchIn) {
				return branchIn == this.get('key');
			},this);
			if (r != undefined) {
				n.set('backbranch',this);
				this.set('node',n);
				this.get('node').linkByKey(branches,nodes);
			}
		},this);
		return this;
	}
});
window.BranchCollection = Backbone.Collection.extend({
	model: Branch
});

