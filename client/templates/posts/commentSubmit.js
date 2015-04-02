Template.commentSubmit.events({
	'submit form': function(e, template){
		e.preventDefault();

		var $body = $(e.target).find('[name=body]');
		var comment = {
			text: $body.val(),
			postID: template.data._id,
			parentID: 0,
			rating: 0,
			date: "3/27/2015",
			userID: Meteor.user()._id
		};

		Comments.insert(comment);

		$body.val('');

	}
});