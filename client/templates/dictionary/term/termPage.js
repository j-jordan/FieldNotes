var label = [];
var label_values = [];

Template.termPage.helpers({
	'getDynamicFields': function(dictId) {
		Session.set("dictionaryID", dictId);
	},

	'getLabelValue': function(termID) {
		Session.set("termID", termID);			
	},

	'labels': function(){
		var dictId = Session.get("dictionaryID");

		var adminLabelIDs = Admin_term_fields.find({dictionaryID: dictId}, {fields: {'AdminlabelsID': 1}}).fetch();
		label = [];
		for (var i = adminLabelIDs.length - 1; i >= 0; i--) {
			label.push(Adminlabels.findOne({_id: adminLabelIDs[i]['AdminlabelsID']}));
		}

		return label;
	},

	'labelDescription' : function(labelId){
		
		var termID = Session.get("termID");

		label_values = [];

		for (var i=0;i < label.length; i++){
			var labelID = label[i]._id;

			label_values.push(Term_label_values.findOne({termID: termID, adminlabelsID: labelID}));
		}

		for(var i = 0; i < label_values.length; i++)
		{
			if(label_values[i].adminlabelsID === labelId)
			{
				return label_values[i].value;
			}
		}
	},

	'getDefinitions': function(termID) {
		var definitions=[];
		
		var definitionIDs = Term_definition.find({termID : termID}, {fields: {definitionID: 1}}).fetch();

		for(var i = definitionIDs.length - 1; i >= 0; i--) {
			definitions.push(Definitions.findOne(definitionIDs[i].definitionID));
		}

		return definitions;
	},

	'isAdmin' : function(){
		if(Meteor.user()){
			if(!Roles.userIsInRole(Meteor.user()._id,'admin')){
				return 'hidden';
			}
		} else {
			return 'hidden';
		}
	}
});

Template.termPage.events({

	'click .editTermButton': function(e){

		$editableButton = $('.editTermButton');

        $editableButton.toggleClass('edit');

        if($editableButton.hasClass('edit')){

            $('[name=uneditableField]').attr('hidden','true');
            $('[name=labelDesc]').attr('hidden','true');
            $('[name=editableInputField').removeAttr('hidden');

            $('[name=deleteTerm]').removeAttr('hidden');


            $editableButton.removeClass('btn-warning');
            $editableButton.addClass('btn-success');
            $editableButton.html('Save changes <span class="glyphicon glyphicon-pencil"></span>');
            $editableButton.attr('type','button');
            
        } else {

        	$('[name=uneditableField').removeAttr('hidden');
            $('[name=labelDesc]').removeAttr('hidden','true');
            $('[name=editableInputField]').attr('hidden','true');

            $('[name=deleteTerm]').attr('hidden','true');


            $editableButton.removeClass('btn-success');
            $editableButton.addClass('btn-warning');
            $editableButton.html('Edit Term <span class="glyphicon glyphicon-pencil"></span>');
            $editableButton.attr('type','submit');
        }


	},

	'click .deleteDefintionButton': function(e){

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
	}

});