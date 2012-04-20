window.ToolbarView = Backbone.View.extend({
	className: 'row',
	events: {

		'click .btn': 'modeClicked',
		'change select': 'bucketizeChanged'
	},
	initialize: function() {
		_.bindAll(this,'render','tpl','bucketablelist','modeClicked','bucketizeChanged');
		this.bucketable = this.options.bucketable;
	},

	bucketablelist: function() {
		return '<select disabled="disabled"> ' + _.map(this.bucketable,function(b){
				return '<option value="'+b+'">'+b+'</option>';
			},this).join() + "</select>";
	},
	
	bucketizeChanged: function() {
		if ($($(this.el).find('.active')).hasClass("bucketize")){ 
			this.bucketize = $(this.el).find('select').val();
		} else {
			this.bucketize = '';
		}
		this.trigger('bucketChange',this.bucketize);
	},

	modeClicked: function(e) {
		e.preventDefault();
		$(this.el).find(".btn").removeClass('active');
		$(e.target).addClass('active');
		if($(e.target).hasClass('bucketize')) {
			$(this.el).find(".bucketable select").removeAttr("disabled");
		} else {
			$(this.el).find(".bucketable select").attr("disabled","disabled");
		}
		this.bucketizeChanged();
	},

	render: function() {
		$(this.el).append(this.tpl());
		return this;
	},
	
	tpl: function() {
		return '<div class="pull-right btn-toolbar">'+
				'<div class="btn-group">'+
					'<a href="#" class="btn active grid"><i class="icon-th">&nbsp;</i></a>'+
					'<a href="#" class="btn bucketize"><i class="icon-signal">&nbsp;</i></a>'+
				'</div>'+
				'<div class="bucketable pull-right">'+
					this.bucketablelist() + 
				'</div>'+
			'</div>';
		}
});
