Template.summaryTemplate.events({
    //Rated event for summaries
    'rated': function(event,value){
        $('[id=rateitDiv' + this._id +']').attr("class","rateit summaryRating");

        var summaryID = this._id;

        var foundSummary = Summaries.findOne(summaryID);

        var oldProduct = foundSummary.quality_rating * foundSummary.numRaters;

        var updatedNumRaters = foundSummary.numRaters + 1;

        //Rebind the rated event
        $("#rateitDiv"+summaryID).bind('rated', function (event, value) {
            var newProduct = oldProduct + value;

            var updatedValue = newProduct / updatedNumRaters;

            console.log(updatedValue, updatedNumRaters);

            Summaries.update({_id: summaryID}, {$set: {quality_rating: updatedValue, numRaters: updatedNumRaters}});
        });
    }
});

Template.summaryTemplate.helpers({
    'markdownedText': function() {
        var converter = new Showdown.converter();
        return converter.makeHtml(this.text);
    }
});
