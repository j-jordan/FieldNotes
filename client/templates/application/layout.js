var rootCategories = Categories.find({ parentID : 0});


Template.layout.helpers({

	categories : rootCategories,

	
});