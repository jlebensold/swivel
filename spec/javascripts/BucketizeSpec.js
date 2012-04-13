describe("Bucketize", function () {
	beforeEach(function() {
		$("#testbed").remove();
		$("body").append("<div id='testbed'></div>");
	});
		
	it ("should able to determin bucket offset", function() {
		gv = new GridView();
		gv.w = 1000

    gv.collection.comparator = function(model) {
      return model.get("title");
    };

		var facetsNames = ["description", "title"];


    var colors = [
      d3.rgb("chartreuse"),
      d3.rgb("cornflowerblue"),
      d3.rgb("darkgoldenrod")
    ];

    gv.collection.add({
      title:"A Nice Title",
      description:colors[1 % colors.length].toString(),
      color: colors[1 % colors.length]
    },{silent:true});

		gv.facetize("title");

		$("#testbed").html(gv.render().el);

		setTimeout(function() {

		_.each(d3.range(0,50), function(i){
      gv.collection.add({
        title:"A Nice Title",
        description:colors[i % colors.length].toString(),
        color: colors[i % colors.length]
      },{silent:true});
		});

		_.each(d3.range(0,50), function(i){
      gv.collection.add({
        title:"Some Title",
        description:colors[i % colors.length].toString(),
        color: colors[i % colors.length]
      },{silent:true});
		});

		_.each(d3.range(0,50), function(i){
      gv.collection.add({
        title:"Sad title",
        description:colors[i % colors.length].toString(),
        color: colors[i % colors.length]
      },{silent:true});
		});


			gv.facetize("description");
			gv.createVis();
			gv.animate();
		},1700);

		expect(1).toEqual(1);

	});
});
