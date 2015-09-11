Template.submitSummary.events({
    /**
    * Handles submit button clicks for submitSummary.html
    *
    * Used when submiting a new summary for a post
    *
    * @param {e} button click event.
    */
    'click input[name=submitSummaryButton]': function(e) {
        console.log(e);
        //Insert the new summary
        var summary = {
            userID: Meteor.user()._id,
            postID: this._id,
            text: Template.instance().$('textarea[name=summary]').val(),
            quality_rating : 0,
            numRaters : 0
        };

        Summaries.insert(summary);
        
        //Redirect to the postpage  
        Router.go('postPage', this);
    }
});
