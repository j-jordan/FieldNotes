Template.commentItem.helpers({
    //Return a username from a user id
    'username': function() {
        return Meteor.users.findOne({_id : this.userID}).username;
    },

    'upPressed': function() {
        var rating = Comment_ratings.findOne({
            'userID': Meteor.user()._id,
            'commentID': this._id,
        });

        if (!rating) {
            return false;
        } else {
            return rating.isUpvote;
        }
    },

    'downPressed': function() {
        var rating = Comment_ratings.findOne({
            'userID': Meteor.user()._id,
            'commentID': this._id,
        });

        if (!rating) {
            return false;
        } else {
            return !rating.isUpvote;
        }
    },
    
    'rating': function() {
        var upvotes = Comment_ratings.find({
            'commentID': this._id,
            'isUpvote': true,
        }).count();
        
        var downvotes = Comment_ratings.find({
            'commentID': this._id,
            'isUpvote': false,
        }).count();
        
        return (upvotes - downvotes);
    },
});

Template.commentItem.events({
    //Click event for the upvote button on a comment
    'click .upArrowButton': function(e){
        var rating = Comment_ratings.findOne({
            'userID': Meteor.user()._id,
            'commentID': this._id,
        });

        if (rating) {
            if (rating.isUpvote) {
                Comment_ratings.remove(rating._id);
            } else {
                Comment_ratings.update(rating._id, {
                    '$set': {
                        'isUpvote': true,
                    }
                });
            }
        } else {
            Comment_ratings.insert({
                'userID': Meteor.user()._id,
                'commentID': this._id,
                'isUpvote': true,
            });
        }
    },
    //Click event for downvote button
    'click .downArrowButton': function(e){
        var rating = Comment_ratings.findOne({
            'userID': Meteor.user()._id,
            'commentID': this._id,
        });

        if (rating) {
            if (rating.isUpvote) {
                Comment_ratings.update(rating._id, {
                    '$set': {
                        'isUpvote': false,
                    }
                });
            } else {
                Comment_ratings.remove(rating._id);
            }
        } else {
            Comment_ratings.insert({
                'userID': Meteor.user()._id,
                'commentID': this._id,
                'isUpvote': false,
            });
        }
    },

    //Click event for delete button
    'click .deleteComment': function(e){
        if (confirm("Are you sure you want to delete this comment?")){
            Comments.remove(this._id);
        }
    },
});
