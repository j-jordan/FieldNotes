/**
 * Handles the submit form action for submitPage.html
 *
 * Save the summary
 * Save the post
 * Insert the _id's into post_summary
 * Check terms collection for any terms in terms_used or terms_defined and get _id's
 * Link the _id's with the post._id in appropriate pivot tables
 * Any terms from terms_defined that weren't found are new terms -> Add them to terms and get back _id's
 * Save the new term _id's into pivot table
 *
 * @param {e} form submit event.
 */
Template.submitPage.events({
	'submit form': function(e) {

		//Stop the browser from submitting the form.
		e.preventDefault();

		//Insert the new summary
		var summary = {
			userID: '',
			text: 'this is test summary text',//$(e.target).find('[name=summary]').val(),
			rating: ''
		};

		summary._id = Summaries.insert(summary);

		//Insert the new post
		var post = {
			userID: 'eumshRhAB92SsrZ9N',//use Meteor.user()._id once users are implemented correctly,
			title: $(e.target).find('[name=title]').val(),
			pop_rating: '',
			quality_rating: '',
			doi: $(e.target).find('[name=doi]').val(),
			author: $(e.target).find('[name=author]').val(),
			publish_date: $(e.target).find('[name=publish_date]').val(),
			publisher: $(e.target).find('[name=publisher]').val(),
			category_id: Categories.findOne({category_name: 'Algorithms'}, {fields: {_id: 1}})   // use $(e.target).find('[name=category]').val() when category dropdown works
		};

		post._id = Posts.insert(post);

		//Insert post/summary entry into pivot table
		var post_sum = {
			postID: post._id,
			summaryID: summary._id
		}

		post_sum._id = Post_summary.insert(post_sum);

		//Find any terms that already exist		
		var terms_defined = $(e.target).find('[name=terms_used]');
		var terms_used = $(e.target).find('[name=terms_defined]');

		//Redirect to the postpage  
		Router.go('postPage',post);
	}
});

Template.submitPage.helpers({
	'submitPageCategoryOptions': function() {
		return Categories.find({parentID: 0});
	}
});