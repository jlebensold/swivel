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
//window.Tile.bind("remove", function() {
//  this.destroy();
//});
window.TileCollection = Backbone.Collection.extend({
	model: Tile,
	bucketing: '',
	activeFacets: {},
  
  active: function() {
    return new TileCollection(this.where({active:true}));
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
