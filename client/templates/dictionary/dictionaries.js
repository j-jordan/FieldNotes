Meteor.subscribe('listAllDictionaries');

Template.dictionaries.helpers({
    //Return all the dictionaries
	'dictionaries': function(){
		return Dictionaries.find();
	}
});

Template.dictionaries.events({

    //Click on the edit button 
   "click .editDictionariesButton": function(event) {

        //Save our button
        $editableButton = $('.editDictionariesButton');

        //Toggle the edit class. Removes 'edit' if present, Appends 'edit' if absent
        $editableButton.toggleClass('edit');

        //If the button has class edit: Remove
        if($editableButton.hasClass('edit')){

            //Make everything with the name editableInputField visible
            $('[name=editableInputField').removeAttr('hidden');

            //Change the look of the edit button
            $editableButton.removeClass('btn-warning')
            $editableButton.addClass('btn-success');
            $editableButton.html('Save changes <span class="glyphicon glyphicon-pencil"></span>');
            
        } else {
            //Make everything with the name editableInputField hidden
            $('[name=editableInputField]').attr('hidden','true');

            //Change the look of the edit button
            $editableButton.removeClass('btn-success');
            $editableButton.addClass('btn-warning');
            $editableButton.html('Remove Dictionary <span class="glyphicon glyphicon-pencil"></span>');
        }

    }, 

    //Click on the delete dictionary button
    'click .deleteDictionary': function(e){
        if(confirm("Are you sure you want to delete this dictionary?")){
            Dictionaries.remove(this._id);
        }
    }
});