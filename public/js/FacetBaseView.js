window.FacetBaseView = Backbone.View.extend({

	capitalizeFirstLetter: function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
	},

	prepareAccordion: function() {
		$(this.el).empty();
		$(this.el).append(
					'<div class="accordion-heading">'+
						'<a class="accordion-toggle" data-toggle="collapse" href="#'+this.elId+'" >'+this.title+'</a>'+
					'</div>'+
					'<div id="'+this.elId+'" class="accordion-body in" style="height: auto;">'+
					'</div>');
	}


});
