window.Tile = Backbone.Model.extend({
	defaults: function() {
		return {
			meta: {},
			active: true,
			template: ''
		};
	},

	initialize: function() {

	}
});


window.TileCollection = Backbone.Collection.extend({
	model: Tile,
	bucketing: '',
	activeFacets: {},
  
  active: function() {
    return new TileCollection(this.where({active:true}));
  },
  
  isBucketing: function() { 
    return this.bucketing.length != 0;
  },

  getBuckets: function() {
    return this.active().reduce(function(memo, item) {
			memo[item.get(this.bucketing)] = memo[item.get(this.bucketing)] || { 
				position:Object.keys(memo).length, 
				count: 0
			}
			memo[item.get(this.bucketing)].count += 1;
			return memo;
		}, {},this);
  },

  getBucketData: function(height,width) { 
    
    var buckets = this.getBuckets();
    var numBuckets =  Object.keys(buckets).length;
    var containerWidth = Math.floor(width / numBuckets);
    var data = [];
    _.each(buckets,function(b,k) { 

      b.w = containerWidth-4;
      b.x = b.position * containerWidth + 0;
      b.y = 20;
      b.h = height;
      b.txt = k;

      data.push(b);
    });
    return data;
  },


	facetfilter: function(facetview,range) {
		
		this.each(function(t) {t.set('active',true);},this);
		this.activeFacets[facetview.title] = {prop: facetview.title.toLowerCase(), fv: facetview};
		_.each(this.activeFacets,function(k) {
			_.each(this.models,function(m) {
				if (!k.fv.contains(m.get(k.prop)))
				{
					m.set('active',false);
				}
			},this);
		},this);
	}
});
window.TileCollection.comparator = function(t) {
  return t.get("meta").title;
};
