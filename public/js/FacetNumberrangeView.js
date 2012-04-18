window.FacetNumberrangeView = FacetBaseView.extend({
	tagName: 'div',
	type: 'numberrange',
	className: 'accordion-group',
	initialize: function() {
		_.bindAll(this,'render','setFacetData','prepareAccordion','contains');
	},
	setFacetData: function(d) {
		this.title = this.capitalizeFirstLetter(d.name);
		this.elId = this.title.replace(' ','');
		this.defaultValues = d.values;
		this.facetvalue = this.defaultValues;
	},

	roundNumber: function(num, dec) {
		return Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
	},

	render: function() {
		this.prepareAccordion();
		
	$(this.el).find('.accordion-body').append('<div style="height:60px;margin: 20px;">'+
				'<div style="float:left;margin: 0 10px;">'+this.roundNumber(this.facetvalue[0],2)+'</div>'+
					'<div class="slider" style="float:left;width: 60%;"></div>'+
				'<div style="float:left;margin:0 10px;">'+this.roundNumber(this.facetvalue[1],2)+
					'</div><div style="margin: 0 0;margin-top:-10px;"><input type="text" class="input-medium" id="'+this.elId+'_value" value="'+this.facetvalue[0] + " - " + this.facetvalue[1]+'"></input>'+
				'</div>');	
	var self = this;
	$(this.el).find('.slider').slider({
			range: true,
			min: this.defaultValues[0],
			max: this.defaultValues[1],
			step: (this.defaultValues[1] - this.defaultValues[0]) / 100,
			values: [ this.defaultValues[0], this.defaultValues[1] ],
			stop: function( event, ui ) {
					$( "#"+self.elId+"_value" ).val(ui.values[0] + " - " + ui.values[1]);
					self.facetvalue = [ui.values[0], ui.values[1]];
					self.trigger('facetChanged',self.facetvalue,self);
			}
		});
		
		return this;
	},

	contains: function(val) { 
		return val < this.facetvalue[1] && val > this.facetvalue[0];
	}

});

