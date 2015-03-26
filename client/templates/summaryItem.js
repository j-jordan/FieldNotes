Template.summaryItem.helpers({

	'title': function(id){
		var post_id = Post_summary.findOne({"summary_id": id}).post_id;
		var title = Posts.find({"_id":post_id}).title;

		return title;
	},

	'userName': function(userID){
		return Users.find({"_id": userID}).username;
	}

});