window.SwivelView = Backbone.View.extend({
	tagName: 'div',
	initialize: function() {
		_.bindAll(this,'render','prepareFacets','facetChanged','updateBucketing');
		this.adapter = new Adapter(this.options.adapter);

		var template = function(rects) {
				rects.append("image")
				.attr("xlink:href",function(d) { return d.model.get('thumbnail'); })
				.attr('width',function(d) { return d.w; })
				.attr('height',function(d) { return d.h; });
			}


    var inspector_template = ''+
      '<h4><%= webTitle %></h4>'+
      '<a href="<%= shortUrl %>">article</a>';

		this.prepareFacets();
		
		this.gv = new GridView({collection:this.adapter.transform(), tileTemplate:template});
		this.gv.w = 900;

		this.toolbar = new ToolbarView({bucketable: this.options.bucketable });
		this.toolbar.bind('bucketChange',this.updateBucketing);

  	this.inspector = new InspectorView({template: inspector_template });
    this.gv.bind('tileClicked',this.inspector.setModel);
  },
	
	updateBucketing: function(val) {
		this.gv.bucketize(val);
		this.gv.animate();
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

	render: function() {
		$(this.el).append(
				'<div class="toolbar row"></div>'+
				'<div class="row-fluid">'+
					'<div class="span2 leftpanel"></div>'+
					'<div class="span8 mainpanel"></div>'+
					'<div class="span2 rightpanel"></div>'+
				'</div>'
		);

		_.each(this.facetviews,function(fv) {
			$(this.el).find('.leftpanel').append(fv.render().el);
		},this);
		$(this.el).find('.mainpanel').append(this.gv.render().el);
		$(this.el).find('.toolbar').append(this.toolbar.render().el);
		$(this.el).find('.rightpanel').append(this.inspector.render().el);
		return this;
	}

});
