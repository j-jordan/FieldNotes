Template.postsList.helpers({
	Post: function() {
		Meteor.subscribe('listAllPosts');

		return Posts.find();
	}
});