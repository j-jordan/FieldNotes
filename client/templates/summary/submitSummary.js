/**
 * Handles the submit form action for submitSummary.html
 *
 * Used when submiting a new summary for a post
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
			postID: $(e.target).find('[name=_id]').val(),
			text: $(e.target).find('[name=summary]').val(),
			quality_rating : 0,
			numRaters : 0
		};

		Summaries.insert(summary);
		
		//Redirect to the postpage  
		Router.go('postPage', {_id: summary.postID});
	}
});
