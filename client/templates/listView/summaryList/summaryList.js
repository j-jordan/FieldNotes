Template.summaryList.helpers({
	'Summaries': function(){
		Meteor.subscribe('listAllSummaries');

		return Summaries.find({})
	}
});