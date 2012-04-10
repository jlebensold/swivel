window.Tile = Backbone.Model.extend({
	defaults: function() {
		return {
			meta: {},
			template: ''
		};
	},

	initialize: function() {

	}
});
window.Tile.bind("remove", function() {
  this.destroy();
});
window.TileCollection = Backbone.Collection.extend({
	model: Tile
});
window.TileCollection.comparator = function(t) {
  return t.get("meta").title;
};
