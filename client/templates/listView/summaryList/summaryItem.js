Template.summaryItem.helpers({

	'title': function(summaryID){

		//Subscribe to the correct post for this summary
		Meteor.subscribe('postIDfromSummaryID', summaryID);

		var post_id = Post_summary.findOne({summaryID: summaryID}).postID;

		return Posts.findOne({_id: post_id}).title;
	},

	'userName': function(userID){
		return Meteor.users.findOne(userID).username;
	}

});