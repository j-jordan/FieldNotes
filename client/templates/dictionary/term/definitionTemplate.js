Template.definitionTemplate.events({
    //Event that is fired before the rated event.
    //Use this event to rebind the rated event. This event only needs to run once because the user can only rate once 
    'beforerated': function(e){

        var definitionID = this._id;

        $("#rateitDiv"+definitionID).bind('rated', function (event, value) { 

            //Find our definition
            var foundDefinition = Definitions.findOne(definitionID);

            //Compute the current value of rating. = quality rating * number of people rated
            var oldProduct = foundDefinition.quality_rating * foundDefinition.numRaters;

            //number of people rated ++
            var updatedNumRaters = foundDefinition.numRaters + 1;

            //Compute the new value of rating. = quality rating * new number of raters
            var newProduct = oldProduct + value;

            //Final value for rating = new value / new # raters.
            var updatedValue = newProduct / updatedNumRaters;

            //Update the definition
            Definitions.update({_id: definitionID}, {$set: {quality_rating: updatedValue, numRaters: updatedNumRaters}});

            //This line is used to make the uneditable stars 'reactive'
            $('#uneditableRateItTemplate'+definitionID).rateit('value',updatedValue);
        });

        //Unbind the beforerated event so that we don't keep binding new rated events
        $(e.target).bind('beforerated',function(e){ e.preventDefault();});
    }
});

Template.definitionTemplate.helpers({
    'markdownedText': function() {
        var converter = new Showdown.converter();
        return converter.makeHtml(this.text);
    }
});
