Template.submitDefinition.onCreated(function() {
  this.previewData = new ReactiveVar;
});

Template.submitDefinition.events({
	'submit form': function(e) {
		//Stop the browser from submitting the form.
		e.preventDefault();

		//Insert the new definition
		var definition = {
			userID: Meteor.user()._id,
			text: $(e.target).find('[name=definition]').val(),
			quality_rating: 0,
			numRaters: 0
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
	},
	
	'input [name=definition], change [name=definition], paste [name=definition], keyup [name=definition], mouseup [name=definition]': function(e) {
		var converter = new Showdown.converter();
		var text = Template.instance().find("textarea[name=definition]").value;
		Template.instance().previewData.set(converter.makeHtml(text));
	}
});

Template.submitDefinition.helpers({
	'preview_data': function() {
		return Template.instance().previewData.get();
	}
});