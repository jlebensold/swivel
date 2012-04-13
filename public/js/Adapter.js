window.Adapter = Backbone.Model.extend({

  initialize: function(options){
    this.fields = options.fields;
    this.data = options.data;
    this.translated = [];
  },

  transform: function(){

    _.each(this.data, function(item) {
      var d = {}
      _.each(this.fields, function(field) {
        d[field[0]] = typeof(field[1]) == 'function' ? field[1](item) : item[field[1]];
      });
      this.translated.push(d);
    },this);

    return this.translated;
  }
});
