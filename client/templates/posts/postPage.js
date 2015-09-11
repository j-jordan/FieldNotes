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
                'modifiedAt': moment(),
            }
        };

        //Update
        Posts.update(this._id, updatedPost);
    },

    'click #user-rating': function(e) {
        var user_rating = Post_quality_ratings.findOne({'userID': Meteor.userId()});

        if (!user_rating) {
            Post_quality_ratings.insert({
                'userID': Meteor.userId(),
                'postID': Template.instance().data._id,
                'rating': Template.instance().$('#user-rating').data('userrating'),
            });
        } else if (user_rating.rating != Template.instance().$('#user-rating').data('userrating')) {
            Post_quality_ratings.update(user_rating._id, {
                '$set': {
                    'rating': Template.instance().$('#user-rating').data('userrating'),
                }
            });
        } else {
            Post_quality_ratings.remove(user_rating._id);
        }
    },
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
    
    'community_quality_rating': function() {
        var all_ratings = Post_quality_ratings.find({
            'postID': Template.instance().data._id,
        });
        
        if (all_ratings.count() == 0) {
            return -1;
        }
        
        var total = 0;
        all_ratings.forEach(function(current) {
            total += current.rating;
        });
        
        return (total / all_ratings.count());
    },

    'user_quality_rating': function() {
        if (!Meteor.userId()) {
            return -1;
        } else {
            var user_rating = Post_quality_ratings.findOne({
                'userID': Meteor.userId(),
                'postID': Template.instance().data._id,
            });
            if (user_rating) {
                return user_rating.rating;
            } else {
                return -1;
            }
        }
    },
});
