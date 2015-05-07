Meteor.subscribe('dictionaryPageTerms');

Template.dictionaryPage.helpers({
	'terms': function(dictID) {
        Meteor.subscribe('dictionaryPageTerms', dictID);

		return Terms.find({dictionaryID: dictID});
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

Template.dictionaryPage.events({
	   "click .editTermsButton": function(event) {

        $editableButton = $('.editTermsButton');

        $editableButton.toggleClass('edit');

        if($editableButton.hasClass('edit')){   
            $('[name=dictName]').attr('hidden','true');
            $('[name=termLink]').attr('hidden','true');
            $('[name=editableInputField').removeAttr('hidden');

            $editableButton.removeClass('btn-warning')
            $editableButton.addClass('btn-success');
            $editableButton.html('Save changes <span class="glyphicon glyphicon-pencil"></span>');
            $editableButton.attr('type','button');
            
        } else {
        	$('[name=dictName').removeAttr('hidden');
            $('[name=termLink').removeAttr('hidden');
            $('[name=editableInputField]').attr('hidden','true');

            $editableButton.removeClass('btn-success');
            $editableButton.addClass('btn-warning');
            $editableButton.html('Edit Title and Terms <span class="glyphicon glyphicon-pencil"></span>');
            $editableButton.attr('type','submit');
        }

    }, 

    'click .deleteTerm': function(e){
        if(confirm("Are you sure you want to delete this term?")){
            Terms.remove(this._id);
        }
    },

    'submit form': function(e){
    	e.preventDefault();

    	var DictionaryData = {
    		name : $(e.target).find('[id=name]').val()
    	};

    	Dictionaries.update(this._id,DictionaryData);
    }
});