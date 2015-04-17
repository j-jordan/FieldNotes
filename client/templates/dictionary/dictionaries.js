Template.dictionaries.helpers({
	'dictionaries': function(){
		return Dictionary.find();
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

Template.dictionaries.events({
   "click .editDictionariesButton": function(event) {

        $editableButton = $('.editDictionariesButton');

        $editableButton.toggleClass('edit');

        if($editableButton.hasClass('edit')){
            $('[name=dictLink]').attr('hidden','true');
            $('[name=editableInputField').removeAttr('hidden');

            $editableButton.removeClass('btn-warning')
            $editableButton.addClass('btn-success');
            $editableButton.html('Save changes <span class="glyphicon glyphicon-pencil"></span>');
            
        } else {
        	$('[name=dictLink').removeAttr('hidden');
            $('[name=editableInputField]').attr('hidden','true');

            $editableButton.removeClass('btn-success');
            $editableButton.addClass('btn-warning');
            $editableButton.html('Remove Dictionary <span class="glyphicon glyphicon-pencil"></span>');
        }

    }, 

    'click .deleteDictionary': function(e){
        if(confirm("Are you sure you want to delete this dictionary?")){
            Dictionary.remove(this._id);
        }
    }
});