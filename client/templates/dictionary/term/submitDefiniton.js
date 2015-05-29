Template.submitDefinition.onCreated(function() {
  this.previewData = new ReactiveVar;
});

Template.submitDefinition.events({
	'submit form': function(e) {
		//Stop the browser from submitting the form.
		e.preventDefault();

		//Insert the new definition
		var definition = {
			termID: $(e.target).find('[name=_id]').val(),
			userID: Meteor.user()._id,
			text: $(e.target).find('[name=definition]').val(),
			quality_rating: 0,
			numRaters: 0
		};

		definition._id = Definitions.insert(definition);

		//Redirect to the postpage  
		Router.go('termPage', {_id: definition.termID});
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