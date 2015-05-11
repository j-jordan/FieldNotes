Template.commentSubmit.events({
	//Submit form for creating a comment
	'submit form': function(e, template){
		//Prevent the default form actions
		e.preventDefault();

		//Update data. Some fields such as date still hardcoded.
		var $body = $(e.target).find('[name=body]');
		var comment = {
			text: $body.val(),
			postID: template.data._id,
			parentID: 0,
			rating: 0,
			date: "3/27/2015",
			userID: Meteor.user()._id
		};

		//Insert the comment
		Comments.insert(comment);

		//Reset the comment box
		$body.val('');
	}
});