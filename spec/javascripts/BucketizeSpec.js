describe("Bucketize", function () {
	beforeEach(function() {
		$("#testbed").remove();
		$("body").append("<div id='testbed'></div>");
	});
		
	it ("should able to determin bucket offset", function() {
		gv = new GridView();
		gv.w = 1000
		var facetsNames = ["description", "title"];


		gv.collection.add({title: "The question", description:"Why?"});
		gv.collection.add({title: "The question", description:"Why?"});
		gv.collection.add({title: "The question", description:"Why?"});
		gv.collection.add({title: "The question", description:"Why?"});
		gv.collection.add({title: "What do do", description:"Some Great Stuff"});
		gv.collection.add({title:"Awesome", description:"Why?"});
		gv.collection.add({title:"Less So", description:"Some Great Stuff"});
		gv.collection.add({title:"Less So", description:"Some Great Stuff"});
		gv.collection.add({title:"Less So", description:"Some Great Stuff"});
		gv.collection.add({title:"Less So", description:"Some Great Stuff"});
		gv.collection.add({title:"bah", description:"forever alone"});



		gv.facetize("title");

		$("#testbed").html(gv.render().el);

		setTimeout(function() {

		_.each(d3.range(0,100), function(){
				gv.collection.add({title:"bah", description:"forever alone"},{silent:true});
		});

			gv.facetize("description");
			gv.createVis();
			gv.animate();
//			gv.collection.add({title:"bah", description:"forever alone"});
		},1700);

		expect(1).toEqual(1);

	});
});
