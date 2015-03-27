// var userName = Users.find().fetch()[]['username'];
var showAllSummaries = new ReactiveVar(false);

var listOfSummaries = [];
Template.postPage.events({
	"click .summary-button": function(event, template) {
		showAllSummaries.set(true);

	}
});

Template.postPage.helpers({
    'findUser': function(userID) {
    	return Users.findOne({_id : userID}).username;
    },


    'findSummaries': function(pageID) {
    	var summaries=[];
    	if(showAllSummaries.get()) {
    		var summaryID = Post_summary.find({postID: pageID}).fetch();
    		for (var i = summaryID.length - 1; i >= 0; i--) {		
    		   	summaries.push(Summaries.findOne(summaryID[i].summaryID));
    		}  		
    		return summaries;
    	}
   		else {
    		var summaryID = Post_summary.findOne({postID: pageID}).summaryID;
			return Summaries.find({_id: summaryID});
    	}
    } 
});