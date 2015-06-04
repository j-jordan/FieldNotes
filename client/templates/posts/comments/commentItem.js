Template.commentItem.helpers({
    //Return a username from a user id
    'findUser': function(userID) {
        return Meteor.users.findOne({_id : userID}).username;
    }
});

Template.commentItem.events({
    //Click event for the upvote button on a comment
    'click .upArrowButton': function(e){
        //If the user is logged in
        if(Meteor.user()) {
            //Save the buttons
            var button = $('[name=upArrow'+this._id+']');
            var downButton = $('[name=downArrow'+this._id+']');

            //Get the comment data
            var comment = Comments.findOne({_id : this._id});
            var commentID = comment._id;        
            var pop_rating =comment.pop_rating;

            //We've clicked on the upvote button but the downvote button was already pressed
            if (downButton.hasClass('pressed')){
                //Increase the rating
                pop_rating = pop_rating + 1;

                //Update the comment
                Posts.update({_id:commentID}, {$set : {pop_rating: pop_rating}});

                //Toggle the class and change the look
                downButton.toggleClass("pressed");
                downButton.toggleClass("btn-danger");
            }

            //We've clicked on the upvote button but the upvote button was already pressed
            if (button.hasClass('pressed')){        
                //undo the upvote
                pop_rating = pop_rating -1;

                //Update the comment
                Comments.update({_id: commentID}, {$set : { pop_rating: pop_rating}});

            }
            //Upvote the comment
            else{        
                //Increase
                pop_rating = pop_rating + 1;

                //Upvote the comment
                Comments.update({_id : commentID},{$set : { pop_rating: pop_rating}});
            }

            //Toggle the class
            button.toggleClass("pressed");

            button.toggleClass("btn-info");
        }
    },
    //Click event for downvote button
    'click .downArrowButton': function(e){
        //If the user is logged in
        if(Meteor.user()) {

            //Save the buttons
            var button = $('[name=downArrow' + this._id+']');
            var upButton = $('[name=upArrow'+this._id+']');

            //Find the comment data
            var comment = Comments.findOne({_id: this._id}),
            commentID = comment._id,
            pop_rating = comment.pop_rating;

            //We've clicked the downvote button but the upvote button has already been pressed
            if (upButton.hasClass('pressed')){
                //Decrease the rating
                pop_rating = pop_rating - 1 ;

                //Update the comment
                Comments.update({_id:commentID}, {$set : {pop_rating: pop_rating}});

                //Toggle and change the look
                upButton.toggleClass("pressed");
                upButton.toggleClass("btn-info");
            }
            //We've clicked the downvote button but the downvote has already been pressed
            if (button.hasClass('pressed')){
                //Undo the downvote
                pop_rating = pop_rating +1 ;

                //Update comment
                Comments.update({_id:commentID}, {$set : {pop_rating: pop_rating}});
            }
            //Downvote the comment
            else {
                //Decrease
                pop_rating = pop_rating -1;

                //Update
                Comments.update({_id:commentID}, {$set : {pop_rating: pop_rating}});
            }

            //Toggle 'pressed' and change the look of the button
            button.toggleClass("pressed");
            button.toggleClass("btn-danger");
        }
    }
});
