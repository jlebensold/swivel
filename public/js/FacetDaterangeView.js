window.FacetDaterangeView = FacetBaseView.extend({
	tagName: 'div',
	className: 'accordion-group',
	initialize: function() {
		_.bindAll(this,'render','setFacetData','prepareAccordion');
	},
	setFacetData: function(d) {
		this.title = this.capitalizeFirstLetter(d.name);
		this.elId = this.title.replace(' ','');
		this.values = d.values;
		this.facetvalue = [this.renderDate(new Date(this.values[0])), this.renderDate(new Date(this.values[1]))];
	},
	
	renderDate: function(d) {
		return d.getDay() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
	},

	render: function() {
		this.prepareAccordion();
		
	$(this.el).find('.accordion-body').append('<div style="height:60px;margin: 20px;">'+
				'<input type="text" class="input-small startDate" value="'+this.facetvalue[0]+'" />'+
				' - ' + 
				'<input type="text" class="input-small endDate" value="'+this.facetvalue[1]+'" />'+
				'</div>');	
	var self = this;
	$(this.el).find('.startDate').datepicker({
		format: 'dd-m-yyyy'	
		})
		.on('changeDate', function(ev){
			self.facetvalue[0] = self.renderDate(new Date(ev.date));
			self.trigger('facetChanged',self.facetvalue,self);
		});
	$(this.el).find('.endDate').datepicker({
		format: 'dd-m-yyyy'	
		}).on('changeDate', function(ev){
			self.facetvalue[1] = self.renderDate(new Date(ev.date));
			self.trigger('facetChanged',self.facetvalue,self);
		});	
		return this;
	}



});
