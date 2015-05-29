Template.categoryPage.helpers({
	//Return the matched posts by categoryID
	'posts': function(catId){
		return Posts.find({categoryID: catId});
	}
});