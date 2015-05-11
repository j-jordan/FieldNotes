Template.summaryListByCategory.helpers({
	//Return a cursor of summaries from a category id
	'summaries': function(_categoryID){
		
		//Subscription for the cursor of post_summary
		Meteor.subscribe('summariesByCategory', _categoryID);

		//Get all the data from the now correctly filled post_summary collection
		var summaryIDs = Post_summary.find({}).fetch();

		var summaries = [];

		//Push just the summary ids
		for (var i = summaryIDs.length - 1; i >= 0; i--) {
			summaries.push(summaryIDs[i].summaryID);
		};

		//Find the summaries in the array of ids
		return Summaries.find({_id: {$in: summaries}});
	}
});