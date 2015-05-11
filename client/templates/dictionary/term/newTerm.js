var labelDescription = [];
var dynamicFields = [];

Template.newTerm.helpers({
	'getDynamicFields': function(dictId){
		
		//Subscribe to the cursor of admin labels for this dictionary
		Meteor.subscribe('adminLabels', dictId);

		/*var adminLabelIDs = Admin_term_fields.find({dictionaryID: dictId}, {fields: {'AdminlabelsID': 1}}).fetch();

		dynamicFields = [];
		
		for (var i = adminLabelIDs.length - 1; i >= 0; i--) {
			dynamicFields.push(Adminlabels.findOne({_id: adminLabelIDs[i]['AdminlabelsID']}));
	}*/
		dynamicFields = Adminlabels.find({}).fetch();
		return dynamicFields;
	}
}); 

Template.newTerm.events({
	//Submit form event for creating a new term
	'submit form': function(e){
		//Prevent the default actions
		e.preventDefault();		

		//Data for dictionary page. Used just to pass with router
		var dictionary = { 
			name: this.name,
			_id: this._id
		};

		//Update data for term
		var term = {
			term_name: $(e.target).find('[name=term_name]').val(),
			dictionaryID: this._id
		};

		//Update terms
		term._id = Terms.insert(term);

		//Update data for definition
		var defintion = {
			userID: Meteor.user()._id,
			text: $(e.target).find('[name=definition]').val(),
			rating: 0
		};

		//Update definition
		defintion._id = Definitions.insert(defintion);

		//Update data for term_definition post data
		var termDefinition = {
			termID: term._id,
			definitionID: defintion._id
		};			

		//Update term_definition pivot collection
		Term_definition.insert(termDefinition);	

		//Reset labelDescription
		labelDescription = [];

		//For every element with the name labelValue put it's value to labelDescription
		$(e.target).find('[name="labelValue"]').each(function(){
			labelDescription.push($(this).val());
		});

		//Update
		for(var i=0; i<dynamicFields.length ; i++) {

			//Update data
			var pivot_data = {
				termID: term._id,
				adminlabelsID: dynamicFields[i]['_id'],
				value: labelDescription[i]
			};

			//Update pivot table
			Term_label_values.insert(pivot_data);
		}
 		
 		//Route to the dictionary page and send it the data
		Router.go('dictionaryPage',dictionary);
	}
});