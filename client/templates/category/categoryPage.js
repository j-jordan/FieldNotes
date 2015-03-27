Template.categoryPage.helpers({
	'posts': function(catId){
		return Posts.find({categoryID: catId});	
	}
});