// var userName = Users.find().fetch()[]['username'];

Template.postPage.helpers({
    'findUser': function(userID) {
    	return Users.findOne({_id : userID}).username;
    },

    'findSummaries': function(postID) {
    	var summaryID = Post_summary.findOne({postID: postID}).summaryID;
		return Summaries.findOne({_id: summaryID}).text;
    }
});