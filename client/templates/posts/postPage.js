Template.postPage.onCreated(function() {
    // flag for toggling summaries
    this.showAllSummaries = new ReactiveVar(false);
    // flag for toggling edit mode
    this.editMode = new ReactiveVar(false);
});

Template.postPage.events({
    //Click event for showing all summaries
    "click .summary-button": function(event, template) {
        //Update the reactive flag
        var sas = Template.instance().showAllSummaries;
        sas.set(!sas.get());
    },
    
    //Beforerated event for the rate stars on the post page
    //Used to rebind the 'rated' event before it fires.
    //TODO(James): horribly broken. post/summary ratings need to be redone.
    'beforerated .rateit': function(event,value){
        //Make sure we only change the rated event of the correct item. In this case we want to change summaries
        if(! event.target.hasClass("summaryRating")) {

            //Get the old data, and any new data that doesn't require the actual rating from the user
            var postID = this._id;

            var foundPost = Posts.findOne(postID);

            var oldProduct = foundPost.quality_rating * foundPost.numRaters;

            var updatedNumRaters = foundPost.numRaters + 1;

            //Bind the rated event and compute the new values with 'value'
            $("#rateitDiv"+this._id).bind('rated', function (event, value) {

                var newProduct = oldProduct + value;

                var updatedValue = newProduct / updatedNumRaters;

                //Update the rating
                Posts.update({_id: postID}, {$set: {quality_rating: updatedValue, numRaters: updatedNumRaters}});

                //Update the template so that it appears reactive
                $('#uneditableRateItTemplate').rateit('value',updatedValue);
            });
        }
    },

    //Click event for the edit post button
    "click .editPostButton": function(event) {
        // Enable edit mode
        Template.instance().editMode.set(true);
    },

    //Click event for deleting a summary
    'click .deleteSummary': function(e) {
        if(confirm("Are you sure you want to delete this summary?")){
            Summaries.remove(this._id);
        }
    },

    //Click event for saving changes to a post
    'click .savePostButton': function(e) {
        // Disable edit mode
        Template.instance().editMode.set(false);

        //Update data. For fields that aren't updated, grab their old value
        var updatedPost = {
            $set : {
                'doi': Template.instance().$('[id=doi]').val(),
                'author': Template.instance().$('[id=author]').val(),
                'publisher': Template.instance().$('[id=publisher]').val(),
                'publish_date': Template.instance().$('[id=publish_date]').val(),
            }
        };

        //Update
        Posts.update(this._id, updatedPost);
    }
});

Template.postPage.helpers({
    'findUser': function(_userID) {
        return Meteor.users.findOne(_userID).username;
    },

    'allSummaries': function() {
        return Summaries.find({postID: this._id});
    },
    
    'topSummary': function() {
        return Summaries.find({postID: this._id}, {sort: {quality_rating: -1}, limit: 1});
    },

    'comments': function() {
        return Comments.find({postID: this._id});
    },

    //Return all the terms used in this paper
    'terms_used': function() {
        return Terms.find({_id: {$in: this.usedTermIDArray}});
    },

    //Return all terms defined in this paper
    'terms_defined': function() {
        return Terms.find({_id: {$in: this.definedTermIDArray}});
    },

    'showAllSummaries': function() {
        return Template.instance().showAllSummaries.get();
    },

    'editMode': function() {
        return Template.instance().editMode.get();
    },
});
