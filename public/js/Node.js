window.Node = Backbone.Model.extend({
	defaults: function() {
		return {
			branches: null,
			backbranch: null, 
			type: "",
			inc: [],
			out: []
		}
	},
	initialize: function() {
		this.set('branches',new BranchCollection);
	},
	branchByKey: function(key) {
		var result = this.get('branches').find(function(b) { 
			return b.get('key') == key; 
		},this);

		if (result != undefined)
			return result;
		this.get('branches').each(function(b) {
			var r = b.get('node').branchByKey(key);
			if (r != undefined) 
				result = r;
		},this);

		if (result != undefined) 
			return result;
		return false;

		
	},


	addBranch: function(b) {
		if (!(b instanceof Branch))
			b = new Branch({backnode: this,txt:b.txt,key:b.key});
		else
			b.set('backnode',this);

		this.get('branches').add(b);
	},

	asJSON: function() {
		var json = {branches: []};
		this.get('branches').each(function(k){
			json.branches.push(k.asJSON());
		},this);
		json.type = this.get('type');
		return json;
	},

	treeDepth: function() {
		var depths = _.map(this.get('branches').models,function(k){
			return (k.get('node') != null) ? 1 + k.get('node').treeDepth() : 1;
		},this);
		if (depths.length == 0)
			return 1;
		return _.max(depths); 
	},

	linkByKey: function(branches,nodes) {
		_.each(this.get('out'),function(o) {
		
			var key = _.find(branches,function(b) { 
				return b.get('key') == o;
			});
			this.addBranch(key);
			this.get('branches').last().linkByKey(branches,nodes);
		
		},this);
		return this;
	},

	depth: function() { 
		var d 	= 1,
				bb 	= this.get('backbranch');


		while(bb != null) {			
			d++;
			if (bb.get('backnode')) {
//				d++;
				if(bb.get('backnode').get('backbranch')){
					bb = bb.get('backnode').get('backbranch')
				}
				else {
					break;
				}
			}
		}
		return d;
	}

});

