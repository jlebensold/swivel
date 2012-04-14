window.FacetStringView = Backbone.View.extend({
	tagName: 'div',
	className: 'accordion-group',
	events: {
		"change input": "facetChanged"
	},
	initialize: function() {
		_.bindAll(this,'render','setFacetData','prepareAccordion','facetChanged');
	},
	setFacetData: function(d) {
		this.title = this.capitalizeFirstLetter(d.name);
		this.elid = this.title.replace(' ','');
		this.values = d.values;
	},

	capitalizeFirstLetter: function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
	},

	facetChanged: function() {
		console.log(_.map($(this.el).find("input:checked"),function(e) { return $(e).val(); } ));
	},

	prepareAccordion: function() {
		
		$(this.el).empty();
		$(this.el).append(
					'<div class="accordion-heading">'+
						'<a class="accordion-toggle" data-toggle="collapse" href="#'+this.elId+'" >'+this.title+'</a>'+
					'</div>'+
					'<div id="'+this.elId+'" class="accordion-body in" style="height: auto;">'+
						'<ul class="unstyled"></ul>'+
					'</div>');
	},

	render: function() {
		this.prepareAccordion();
	
		_.each(this.values,function(v) {
			$(this.el).find('ul').append('<li><label class="checkbox"><input type="checkbox" value="'+v+'" ></input>'+v+'</label></li>');
		},this);
		return this;
	}

});
