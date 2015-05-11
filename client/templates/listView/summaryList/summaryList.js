//Subscribe to the list of summaries
Meteor.subscribe('summaries');

Template.summaryList.helpers({
	'Summaries': function(){
		return Summaries.find({})
	}
});