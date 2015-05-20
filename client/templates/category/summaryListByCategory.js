Template.summaryListByCategory.helpers({
	//Return a cursor of summaries from a category id
	'summaries': function(_categoryID){
		//Subscription for the cursor of post_summary
		Meteor.subscribe('summariesByCategory', _categoryID);

		return Summaries.find({}).fetch();
	}
});
