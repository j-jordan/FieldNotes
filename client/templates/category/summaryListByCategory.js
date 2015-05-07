Template.summaryListByCategory.helpers({
	'summaries': function(categoryID){
		var categoryID = categoryID;

		var posts = Posts.find({categoryID: categoryID}).fetch();

		var postIDs = [];

		for (var i = posts.length - 1; i >= 0; i--) {
			postIDs.push(posts[i]._id);
		};

		var summaryIDs = Post_summary.find({postID: {$in: postIDs}}).fetch();

		var summaries = [];

		for (var i = summaryIDs.length - 1; i >= 0; i--) {
			summaries.push(summaryIDs[i].summaryID);
		};

		return Summaries.find({_id: {$in: summaries}});
	}
});