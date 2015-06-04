Template.termPage.onCreated(function() {
    this.showAllDefinitions = new ReactiveVar(false);
});

Template.termPage.helpers({
    //Return the admin labels for a dictionary
    'labels': function(_dictionaryID){
        return Adminlabels.find({dictionaryID: _dictionaryID});
    },

    //Return the correct value for a label
    'labelDescription' : function(){
        var _labelID = this._id;
        var _termID = Template.parentData(1)._id;

        //Get the label value
        var value = Term_label_values.findOne({ termID: _termID, adminlabelsID: _labelID });
        
        if (!value) {
            return "TID:" + _termID + "/ALID:" + _labelID;
        }
        
        return value.value;
    },

    //Find all definitions for given term id
    'findDefinitions' : function(_termID){
        //If showallDefinitions is true, we want to show all definitions
        if (Template.instance().showAllDefinitions.get()) {
            return Definitions.find({termID: _termID});
        }
        //else we want to show the top rated definition
        else {
            //Sort the definitions by quality_rating, highest at top, then grab the first one
            return Definitions.find({termID: _termID}, {sort: {quality_rating: -1}, limit: 1});
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
        }
    },

    'submit form': function(e){
        e.preventDefault();

        var termID = this._id;

        //update the term from terms
        var updateTermData = {
            $set : {
                term_name: $(e.target).find('[name=term_name]').val(),
            }
        }

        Terms.update(this._id, updateTermData);

        var labelsID = [];

        $(e.target).find('[name=adminLabelID]').each(function(){
            labelsID.push($(this).val());
        });

        //update the terms_label_values collection
        $(e.target).find('[name="labelValue"]').each(function(index){
            //updated term_label_value data
            var updateValueData = {
                $set : {
                    termID : termID,
                    adminlabelsID : labelsID[index],
                    value : $(this).val()
                }
            };

            var id = Term_label_values.findOne({adminlabelsID: labelsID[index], termID: termID})._id;
            Term_label_values.update(id, updateValueData);
        });
    },

    'click .definition-button': function(e){
        var $definitionButton = $('.definition-button');

        var sad = Template.instance().showAllDefinitions;
        sad.set(!sad.get());  

        $definitionButton.toggleClass('show');

        if($definitionButton.hasClass('show')){
            $definitionButton.text('Show top Definition');
        } else {
            $definitionButton.text('Show all Definitions');
        }
    }

});
