Template.summaryItem.helpers({
	//Return the title of a post for the summaryItems
	'title': function(summaryID){

		//Subscribe to the correct cursor from post_summary for this summary
		Meteor.subscribe('postFromSummaryID', summaryID);

		//Return the post
		return Posts.findOne({}).title;
	},
	//Return the username from a user id
	'userName': function(userID){
		return Meteor.users.findOne(userID).username;
	}

});