window.SwivelView = Backbone.View.extend({
	tagName: 'div',
	initialize: function() {
		_.bindAll(this,'render','prepareFacets','facetChanged','facetize');
		this.adapter = new Adapter(this.options.adapter);

		var template = function(rects) {
				rects.append("image")
				.attr("xlink:href",function(d) { return d.model.get('thumbnail'); })
				.attr('width',function(d) { return d.w; })
				.attr('height',function(d) { return d.h; });
			}
		this.prepareFacets();
		this.gv = new GridView({collection:this.adapter.transform(), tileTemplate:template});
		this.gv.w = 1100;
	},
	prepareFacets: function() {
	this.facetviews = _.map(this.adapter.facets(),function(f) { 
			var facetview; 
			switch(f.type) {
				case 'collection':
				case 'string':
					facetview = new FacetStringView();
					break;
				case 'numberrange':
					facetview = new FacetNumberrangeView();
					break;
				case 'daterange':
					facetview = new FacetDaterangeView();
					break;
				default:
					throw 'collection not defined';
			}
			facetview.setFacetData(f);
			facetview.bind('facetChanged',this.facetChanged);
			return facetview;
		},this);


	},
	//TODO
	facetChanged: function(e,v) {

		this.gv.collection.facetfilter(v,e);
		this.gv.addTile();	
		this.gv.removeTile();
		this.gv.animate();
	},
	//TODO
	facetize: function(facet) {
		this.gv.facetize(facet);
		this.gv.animate();
	},

	render: function() {
		$(this.el).append(
				'<div class="row">'+
					'<div class="span3 leftpanel"></div>'+
					'<div class="mainpanel"></div>'+
				'</div>'
		);

		_.each(this.facetviews,function(fv) {
			$(this.el).find('.leftpanel').append(fv.render().el);
		},this);
		$(this.el).find('.mainpanel').append(this.gv.render().el);
		return this;
	}

});
