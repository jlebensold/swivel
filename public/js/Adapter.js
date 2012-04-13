window.Adapter = Backbone.Model.extend({

  initialize: function(options){
    this.fields = options.fields;
    this.data = options.data;
    this.translated = [];
		this.faceted = {};
  },

  transform: function(){
		if(this.translated.length > 0)
			return this.translated;
    _.each(this.data, function(item) {
      var d = {}
      _.each(this.fields, function(field) {
        d[field[0]] = typeof(field[1]) == 'function' ? field[1](item) : item[field[1]];
      });
      this.translated.push(d);
    },this);

    return this.translated;
  },

  facets: function(){
  	if (this.faceted.length > 0)
			return this.faceted;
		_.each(this.transform(),function(item) {
			_.each(this.fields,function(field) {
				if (this.faceted[field[0]] == undefined) 
				{
					this.faceted[field[0]] = [];
				}
				this.faceted[field[0]].push(item[field[0]]);
			},this);
		},this);
		this.faceted = _.compact(_.map(this.faceted,this.convertField,this));
		
		return this.faceted;
  },

	convertField: function(values,fieldName) {
		var type = this.fieldType(fieldName);

		//support for identifying things that should not become facets
		if (type == undefined) 
			return null;
		switch(type)
		{
			case 'string':
			case 'collection':
				return {name: fieldName, values: _.compact(_.uniq(_.flatten(values))), type:type};
			case 'numberrange':
				var nums = _.map(values,function(v) { return parseFloat(v); });
				return {name: fieldName, values: [_.min(nums), _.max(nums)],type:type};
			case 'daterange':
				var nums = _.map(values,function(v) { return Date.parse(v); });			
				return {name: fieldName, values: [new Date(_.min(nums)), new Date(_.max(nums))], type:type};
		}
		return {name: fieldName,values: values, type:type};
	},

	fieldType: function(field) {
		var f = _.find(this.fields,function(f) { return f[0] == field; });
		return f[2];
	}
});
