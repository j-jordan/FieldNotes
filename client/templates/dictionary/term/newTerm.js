var labelDescription = [];
var dynamicFields = [];

Template.newTerm.helpers({
    'getDynamicFields': function(dictId){
        dynamicFields = Adminlabels.find({dictionaryID: dictId}).fetch();
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
            termID: term._id,
            userID: Meteor.user()._id,
            text: $(e.target).find('[name=definition]').val(),
            quality_rating : 0,
            numRaters : 0,
        };

        //Update definition
        defintion._id = Definitions.insert(defintion);

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
