Template.summaryItem.helpers({
	//Return the title of a post for the summaryItems
	'title': function(_summaryID){
		Meteor.subscribe('lookupSummary', _summaryID);
		
		var summary = Summaries.findOne({_id: _summaryID});
		if (!summary) {
			return "SID:" + _summaryID;
		}
		
		Meteor.subscribe('lookupPost', summary.postID);
		
		var post = Posts.findOne({_id: summary.postID});
		if (!post) {
			return "PID:" + summary.postID;
		}

		return post.title;
	},
	//Return the username from a user id
	'userName': function(userID){
		Meteor.subscribe('lookupUsername', userID)
		var user = Meteor.users.findOne(userID)
		if (!user) {
			return "UID:" + userID;
		}
    	return user.username;
	},

	'postLinkData': function() {
		var summary = Summaries.findOne({_id: this._id});
		return {_id: summary.postID};
	}

});
