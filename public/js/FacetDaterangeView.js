window.FacetDaterangeView = FacetBaseView.extend({
	tagName: 'div',
	type: 'daterange',
	className: 'accordion-group',
	initialize: function() {
		_.bindAll(this,'render','setFacetData','prepareAccordion','contains');
	},
	setFacetData: function(d) {
		this.title = this.capitalizeFirstLetter(d.name);
		this.elId = this.title.replace(' ','');
		this.values = this.stringsToDates(d.values);		
		this.facetvalue = [this.renderDate(this.values[0]), this.renderDate(this.values[1])];
	},
	stringsToDates: function(values) {
		return _.map(values,function(v) {
			return new Date(Date.parse(v));
		},this);
	},
	renderDate: function(d) {
		return d.format('yyyy-m-dd');
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
		format: 'yyyy-m-dd'	
		})
		.on('changeDate', function(ev){
			self.facetvalue[0] = self.renderDate(new Date(ev.date));
			self.trigger('facetChanged',self.facetvalue,self);
		});
	$(this.el).find('.endDate').datepicker({
		format: 'yyyy-m-dd'	
		}).on('changeDate', function(ev){
			self.facetvalue[1] = self.renderDate(new Date(ev.date));
			self.trigger('facetChanged',self.facetvalue,self);
		});	
		return this;
	},
	contains: function(val) {
		var d = new Date(Date.parse(val)).getTime();
		var dateRange = this.stringsToDates(this.facetvalue);
		return (d < dateRange[1].getTime()) && (d > dateRange[0].getTime());
	}



});
