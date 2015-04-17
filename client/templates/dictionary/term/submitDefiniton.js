Template.submitDefinition.events({
	'submit form': function(e) {
		//Stop the browser from submitting the form.
		e.preventDefault();

		//Insert the new definition
		var definition = {
			userID: Meteor.user()._id,
			text: $(e.target).find('[name=definition]').val(),
			rating: ''
		};

		definition._id = Definitions.insert(definition);
		
		//Insert post/summary entry into pivot table
		var term_def = {
			termID: $(e.target).find('[name=_id]').val(),
			definitionID: definition._id
		}

		term_def._id = Term_definition.insert(term_def);

		var termName = $(e.target).find('[name=term_name]').val();

		//Redirect to the postpage  
		Router.go('/term/'+termName);
	}
});