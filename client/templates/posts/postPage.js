// var userName = Users.find().fetch()[]['username'];

Template.postPage.helpers({
    'findUser': function(userID) {
    	return Users.find({_id : userID}).fetch()[0]['username'];
    },

    'findSummaries': function(postID) {
    	var summaryID = Post_summary.find({postID: postID}).fetch()[0]['summaryID'];
		return Summaries.find({_id: summaryID}).fetch()[0]['text'];
    }
});