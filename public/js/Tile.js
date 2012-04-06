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

window.TileCollection = Backbone.Collection.extend({
	model: Tile
});
