Template.newDictionary.onCreated(function () {
    // Used to keep track of rows.
    this.numLabels = new ReactiveVar(0);
});

Template.newDictionary.helpers({
    //getArray is used to create the correct number of rows in the new dictionary page
    //the returned object of index are used to differentiate each HTML element
    'getArray': function() {
        var labelArray = [];

        var length = Template.instance().numLabels.get();
        for (var i = 0; i < length; i++) {
            labelArray.push({ 'index': i});
        }

        return labelArray;
    }
});

Template.newDictionary.events({
    //Click event to add a row
    'click #increaseRow ': function(event) {
        // Change the length of the array returned by 'getArray'
        var num = Template.instance().numLabels;
        num.set(num.get()+1);
    },

    //Click event to delete a row
    'click #deleteRow': function(event) {
        //Get the index of the clicked row
        var index = this.index;

        //Remove the approriate row
        $('#row'+index).remove()
    },

    //Submit button for new dictionary
    'click button[name=createDictionaryButton]': function(e) {
        //Validation flag
        var validated = true;

        //Map function for each element that is required.
        Template.instance().$('.required').map(function(index, object){
            //If any element doesn't have a value, we should fail validation
            if(this.value === '')
                validated = false;
        })

        //If everything passed validation
        if (!validated) {
            alert("Please fill out all required fields");
            return;
        }

        //update data
        var dictionary = {
            name: Template.instance().$('[name=title]').val()
        };

        //update
        dictionary._id = Dictionaries.insert(dictionary);

        //Update data for label names
        var labelNames = [];
        //Update data for label descriptions
        var labelDescription = [];

        //Function for each element that has name dynamicVarName
        Template.instance().$('[name="dynamicVarName[]"]').each(function() {
            //use this.val() to get the values of each
            labelNames.push($(this).val());
        });

        //Function for each element that has name variableType
        Template.instance().$('[name="variableType[]"]').each(function() {
            //use this.val() to get the values of each name
            labelDescription.push($(this).val());
        });

        //Update
        for(var i = 0; i < labelNames.length; i++)
        {
            //Update data. Grab the positions out of label names/description
            var adminLabel = {
                dictionaryID: dictionary._id,
                label : labelNames[i],
                description : labelDescription[i]
            };

            //Update
            Adminlabels.insert(adminLabel);
        }

        //Route back to the list of dictionaries to see you newly created dictionary
        Router.go('dictionaries');
    }
});
