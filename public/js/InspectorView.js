window.InspectorView = Backbone.View.extend({
  tagName: "div",
  initialize: function() {
    this.template = this.options.template;
    _.bindAll(this,'render','setModel');
  
  },
  setModel: function(m) {
    this.model = m;
    this.render();
  },

  render: function() {
    if (this.model != undefined)
      $(this.el).html(_.template(this.template,this.model.toJSON()));
    else
      $(this.el).html("<h3>inspector</h3>");
    return this;
  }

  
});
