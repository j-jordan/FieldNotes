Template.categoryPage.helpers({
	//Return the matched posts by categoryID
	'posts': function(catId){
		Meteor.subscribe('getPostsFromCategoryID', catId);
		return Posts.find({categoryID: catId});
	}
});