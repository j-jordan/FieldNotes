Template.dictionaryPage.helpers({
    //Return all terms for this dictionary
	'terms': function(dictID) {
        //Return the terms
		return Terms.find({dictionaryID: dictID});
	}
});

Template.dictionaryPage.events({
    //Click event for the edit terms button
   "click .editTermsButton": function(event) {

        //Save the button
        $editableButton = $('.editTermsButton');

        //Toggle the edit class. Removes 'edit' if present, Appends 'edit' if absent
        $editableButton.toggleClass('edit');

        //Start editing
        if($editableButton.hasClass('edit')){   
            //Make everything with the name 'editableInputField' hidden
            $('[name=editableInputField').removeAttr('hidden');

            //Change the look of the button
            $editableButton.removeClass('btn-warning')
            $editableButton.addClass('btn-success');
            $editableButton.html('Save changes <span class="glyphicon glyphicon-pencil"></span>');

            //Change the type of button back to button so that it doesn't auto-submit our form
            $editableButton.attr('type','button');
            
        } 
        //Done editing
        else {
            //Hide everything with the name 'editableInputField'
            $('[name=editableInputField]').attr('hidden','true');

            //Change the look of the button
            $editableButton.removeClass('btn-success');
            $editableButton.addClass('btn-warning');
            $editableButton.html('Edit Title and Terms <span class="glyphicon glyphicon-pencil"></span>');

            //Change the type of the button to submit, so that it will auto-submit our form
            $editableButton.attr('type','submit');
        }
    }, 

    //Click event for delete term
    'click .deleteTerm': function(e){
        if(confirm("Are you sure you want to delete this term?")){
            var termID = this._id;
            Tracker.autorun(function (computation) {
                var valSub = Meteor.subscribe('getLabelValuesFromTermID', termID);
                var defSub = Meteor.subscribe('getDefinitionsFromTermID', termID);
                if (!valSub.ready() || !defSub.ready()) {
                    return;
                }
                Term_label_values.find({ termID: termID }).forEach(function(val) {
                    Term_label_values.remove({_id: val._id });
                });
                Definitions.find({ termID: termID }).forEach(function(def) {
                    Definitions.remove({_id: def._id });
                });
                Terms.remove(termID);
                computation.stop();
            });
        }
    },

    //Form submit event fired when button is changed back to 'type=submit' in click event
    'submit form': function(e){
        //Prevent the form from executing its default actions
    	e.preventDefault();

        //Update data
    	var DictionaryData = {
			$set : {
				name : $(e.target).find('[id=name]').val()
			}
    	};

        //Update
    	Dictionaries.update(this._id,DictionaryData);
    }
});