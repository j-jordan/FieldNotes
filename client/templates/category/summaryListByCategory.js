Template.summaryListByCategory.helpers({
	'summaries': function(_categoryID){
		
		Meteor.subscribe('summariesByCategory', _categoryID);

		var summaryIDs = Post_summary.find({}).fetch();

		var summaries = [];

		for (var i = summaryIDs.length - 1; i >= 0; i--) {
			summaries.push(summaryIDs[i].summaryID);
		};

		return Summaries.find({_id: {$in: summaries}});
	}
});