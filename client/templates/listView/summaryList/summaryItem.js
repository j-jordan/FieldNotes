Template.summaryItem.helpers({
	//Return the title of a post for the summaryItems
	'title': function(summaryID){

		//Subscribe to the correct cursor from post_summary for this summary
		Meteor.subscribe('postIDfromSummaryID', summaryID);

		//Get the post_id. There might be more than one, but they will all be the same
		var post_id = Post_summary.findOne({summaryID: summaryID}).postID;

		//Return the post
		return Posts.findOne({_id: post_id}).title;
	},
	//Return the username from a user id
	'userName': function(userID){
		return Meteor.users.findOne(userID).username;
	}

});