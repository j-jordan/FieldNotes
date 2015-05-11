var label = [];
var label_values = [];

//Instantiate the reactive boolean variable
var showAllDefinitions = new ReactiveVar(false);
var definitionsShown = false;

//Everytime termpage template is rendered
Template.termPage.rendered = function(){

	//Instantiate the flags back to false
	definitionsShown = false;
	showAllDefinitions.set(false);
	
	//Get the termID from the URL because Terms collection somehow resets to [] on refresh
	//But we still have the ID in the URL
	var url = Router.current().url,
	delimeter = '/',
	start = 1,
	tokens = url.split(delimeter).slice(start),
	result = tokens.join(delimeter);
	var termID =  tokens[tokens.length-1];

	//Resubscribe with the ID
	Meteor.subscribe('term', termID);
}

Template.termPage.helpers({
	//Set the session variable dictionaryID
	'getDynamicFields': function(_dictionaryID){
		if(_dictionaryID){
			Session.set('dictionaryID', _dictionaryID);
		}
	},
	//Set the session variable termID
	'getLabelValue': function(termID) {
		Session.set("termID", termID);			
	},

	//Return the admin labels for a dictionary
	'labels': function(dictionaryID){

		//Subscribe to the subset of admin_term_fields for this dictionary
		Meteor.subscribe('admin_fields', dictionaryID);

		return Adminlabels.find({});
	},

	//Return the correct value for a label
	'labelDescription' : function(labelId){
		
		var termID = Session.get("termID");

		//Subscribe to the subset of term_label_values for this term
		Meteor.subscribe('labelValuesForTerms',termID);

		//Get the label values
		label_values = Term_label_values.find({}).fetch();

		for(var i = 0; i < label_values.length; i++)
		{
			//If the label value's adminID is equal to our labelID then we've found the right one
			if(label_values[i].adminlabelsID === labelId)
			{
				//Return the first label value that matches, they will all be the same
				return label_values[i].value;
			}
		}
	},

	//Find all definitions for given term id
	'findDefinitions' : function(termID){
	
		//Subscribe to the subset of definitions for this term
		Meteor.subscribe('allTermDefinitions', termID);

		//If showallDefinitions is true, we want to show all definitions
    	if(showAllDefinitions.get()) {
    		
    		return Definitions.find({});
    	}
    	//else we want to show the top rated definition
   		else {
   			//Sort the definitions by quality_rating, highest at top, then grab the first one
			return Definitions.find({}, {sort: {quality_rating: -1}, limit: 1});
    	}
	},

	//If a user is a guest(or not logged in) return hidden
	'isGuest' : function(){
		if(Meteor.user()){
			return '';
		} else {
			return 'hidden';
		}
	}
});

Template.termPage.events({
	//Click event for editing a term page
	'click .editTermButton': function(e){

		//Save the edit button
		$editableButton = $('.editTermButton');

		//Toggle the edit class
        $editableButton.toggleClass('edit');

        //Start editing
        if($editableButton.hasClass('edit')){
        	//Hide all elements with the name uneditableField
            $('[name=uneditableField]').attr('hidden','true');

            //Hide all elements with the name labelDesc
            $('[name=labelDesc]').attr('hidden','true');

            //Show all elements with the name editableInputField
            $('[name=editableInputField').removeAttr('hidden');

            //Change the look of the button
            $editableButton.removeClass('btn-warning');
            $editableButton.addClass('btn-success');
            $editableButton.html('Save changes <span class="glyphicon glyphicon-pencil"></span>');
            //Change the type of the button to 'type=button' so that the form won't auto-submit
            $editableButton.attr('type','button');
            
        }
        //Finish editing
        else {
        	
        	//Show all elements with the name uneditableField
        	$('[name=uneditableField').removeAttr('hidden');

        	//Show all elements with the name labelDesc
            $('[name=labelDesc]').removeAttr('hidden');

            //Hide all elements with the name editableInputField
            $('[name=editableInputField]').attr('hidden','true');

            //Change the look of the button
            $editableButton.removeClass('btn-success');
            $editableButton.addClass('btn-warning');
            $editableButton.html('Edit Term <span class="glyphicon glyphicon-pencil"></span>');
        	//Change the type of the button to 'type=submit' so that the form auto-submits
            $editableButton.attr('type','submit');
        }
	},

	'click .deleteDefinitionButton': function(e){

		e.preventDefault();

  		if(confirm("Are you sure you want to delete this term?")){
            
            //Remove the defintions collection
            Definitions.remove(this._id);

            //Remove from the pivot table
            var termDefs = Term_definition.findOne({definitionID: this._id});

            Term_definition.remove(termDefs._id);
        }
	},

	'submit form': function(e){
		e.preventDefault();

		var termID = this._id;

		//update the term from terms
		var updateTermData = {
			term_name: $(e.target).find('[name=term_name]').val(),
			dictionaryID: this.dictionaryID
		}
		
		Terms.update(this._id, updateTermData);

		//updated term_label_value data
		var updateValueData = {
			termID: termID
		};

		var labelsID = [];

		$(e.target).find('[name=adminLabelID]').each(function(){
			labelsID.push($(this).val());
		});

		//update the terms_label_values collection
		$(e.target).find('[name="labelValue"]').each(function(index){
			
			updateValueData.adminlabelsID = labelsID[index];
			updateValueData.value = $(this).val();

			var id = Term_label_values.findOne({adminlabelsID: labelsID[index], termID: termID})._id;
			Term_label_values.update(id, updateValueData);
		});
	},

	'click .definition-button': function(e){
        var $definitionButton = $('.definition-button');

        definitionsShown = !definitionsShown;

        showAllDefinitions.set(definitionsShown);  

        $definitionButton.toggleClass('show');

        if($definitionButton.hasClass('show')){
            $definitionButton.text('Show top Definition');
        } else {
            $definitionButton.text('Show all Definitions');
        }
	}

});
