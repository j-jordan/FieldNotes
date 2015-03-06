// var userName = Users.find().fetch()[]['username'];

Template.postPage.helpers({
    'findUser': function(userID) {
    	return Users.find().fetch()[userID]['username'];
    },

    'findSummaries': function(postID) {
    	var summaryID = Post_summary.find({postID: postID}).fetch()[0]['summaryID'];
		return Summaries.find({_id: summaryID}).fetch()[0]['text'];
    }
});
[0]