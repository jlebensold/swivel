window.FacetNumberrangeView = FacetBaseView.extend({
	tagName: 'div',
	className: 'accordion-group',
	initialize: function() {
		_.bindAll(this,'render','setFacetData','prepareAccordion');
	},
	setFacetData: function(d) {
		this.title = this.capitalizeFirstLetter(d.name);
		this.elId = this.title.replace(' ','');
		this.values = d.values;
		this.facetvalue = this.values;
	},

	roundNumber: function(num, dec) {
		return Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
	},

	render: function() {
		this.prepareAccordion();
		
	$(this.el).find('.accordion-body').append('<div style="height:60px;margin: 20px;">'+
				'<div style="float:left;margin: 0 10px;">'+this.roundNumber(this.values[0],2)+'</div>'+
					'<div class="slider" style="float:left;width: 60%;"></div>'+
				'<div style="float:left;margin:0 10px;">'+this.roundNumber(this.values[1],2)+
					'</div><div style="margin: 0 0;margin-top:-10px;"><input type="text" class="input-medium" id="'+this.elId+'_value" value="'+this.values[0] + " - " + this.values[1]+'"></input>'+
				'</div>');	
	var self = this;
	$(this.el).find('.slider').slider({
			range: true,
			min: this.values[0],
			max: this.values[1],
			step: (this.values[1] - this.values[0]) / 100,
			values: [ this.values[0], this.values[1] ],
			slide: function( event, ui ) {
					$( "#"+self.elId+"_value" ).val(ui.values[0] + " - " + ui.values[1]);
					self.facetvalue = [ui.values[0], ui.values[1]];
					self.trigger('facetChanged',self.facetvalue);
			}
		});
		
		return this;
	}

});

