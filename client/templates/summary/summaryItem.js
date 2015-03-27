Template.summaryItem.helpers({

	'title': function(id){
		var post_id = Post_summary.findOne({"summaryID": id}).postID;
		var title = Posts.findOne({"_id" : post_id}).title;
		console.log(title);
		return title;
	},

	'userName': function(userID){
		return Users.find({"_id": userID}).username;
	}

});