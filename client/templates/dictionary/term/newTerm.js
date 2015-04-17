var dynamicFields = [];
var labelDescription = [];

Template.newTerm.helpers({
	'getDynamicFields': function(dictId){
		var adminLabelIDs = Admin_term_fields.find({dictionaryID: dictId}, {fields: {'AdminlabelsID': 1}}).fetch();
		console.log(adminLabelIDs);
		dynamicFields = [];
		for (var i = adminLabelIDs.length - 1; i >= 0; i--) {
			dynamicFields.push(Adminlabels.findOne({_id: adminLabelIDs[i]['AdminlabelsID']}));
		}

		console.log(dynamicFields);
	},
	'dynamFields': function() {
		return dynamicFields;
	}
}); 

Template.newTerm.events({
	'submit form': function(e){
		e.preventDefault();		

		var dictionary = { name: this.name,
						   _id: this._id };

		var term = {
			term_name: $(e.target).find('[name=term_name]').val(),
			dictionaryID: this._id
		};

		term._id = Terms.insert(term);

		var defintion = {
			userID: Meteor.user()._id,
			text: $(e.target).find('[name=definition]').val(),
			rating: 0
		};

		defintion._id = Definitions.insert(defintion);

		var termDefinition = {
			termID: term._id,
			definitionID: defintion._id
		};			

		Term_definition.insert(termDefinition);	

		labelDescription = [];
		$(e.target).find('[name="labelValue"]').each(function(){
			labelDescription.push($(this).val());
		});

		for(var i=0; i<dynamicFields.length ; i++) {
			var pivot_data = {
				termID: term._id,
				adminlabelsID: dynamicFields[i]['_id'],
				value: labelDescription[i]
			};

			Term_label_values.insert(pivot_data);
		}
 
		Router.go('dictionaryPage',dictionary);
	}
});