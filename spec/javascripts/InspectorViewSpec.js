describe("InspectorView",function() {
  
	beforeEach(function() {
		$("#testbed").remove();
		$("body").append("<div id='testbed'></div>");
	});


  it("should render an inspector from a template",function() {
    var foo = "<h1>hello!</h1>";
    var view = new InspectorView({template: foo});
    $("#testbed").html(view.render().el);
    expect($("#testbed").html()).toEqual("<div><h1>hello!</h1></div>");
  });
  
  it("should be able to update the inspector with a new model", function() {
    var foo = "<h1>hello! <%= prop %> </h1>";
    var view = new InspectorView({template: foo,model: new Tile({prop:"boo"})});
    $("#testbed").html(view.render().el);
    expect($("#testbed").html()).toEqual("<div><h1>hello! boo </h1></div>");
    view.setModel(new Tile({prop:"poo"}));
    $("#testbed").html(view.render().el);
    expect($("#testbed").html()).toEqual("<div><h1>hello! poo </h1></div>");
  });

});
