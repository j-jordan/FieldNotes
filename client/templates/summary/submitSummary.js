/**
 * Handles the submit form action for submitSummary.html
 *
 *
 *
 * @param {e} form submit event.
 */
Template.submitSummary.events({
	'submit form': function(e) {

		//Stop the browser from submitting the form.
		e.preventDefault();

		//Insert the new summary
		var summary = {
			userID: Meteor.user()._id,
			text: $(e.target).find('[name=summary]').val(),
			quality_rating : 0,
			numRaters : 0
		};

		summary._id = Summaries.insert(summary);
		
		//Insert post/summary entry into pivot table
		var post_sum = {
			postID: $(e.target).find('[name=_id]').val(),
			summaryID: summary._id
		}

		post_sum._id = Post_summary.insert(post_sum);

		//Redirect to the postpage  
		Router.go(Router.routes['postPage'].path({_id: post_sum.postID}));
	}
});