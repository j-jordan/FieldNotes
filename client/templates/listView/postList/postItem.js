Template.postItem.helpers({
	'getUserName': function(userID) {
    	return Meteor.users.findOne(userID).username;
    },

    'loggedIn': function(){
        if(Meteor.user())
            return true;
        else 
            return false;
    }

});

Template.postItem.events({

	'click .upArrowButton': function(e){
		if(Meteor.user()) {
			var button = $('[name=upArrow'+this._id+']');
			var downButton = $('[name=downArrow'+this._id+']');

			var post = Posts.findOne({_id : this._id});
			var postID = post._id;		
			var pop_rating =post.pop_rating;

			if (downButton.hasClass('pressed')){
				pop_rating = pop_rating + 1;
				Posts.update({_id:postID}, {$set : {pop_rating: pop_rating}});
				downButton.toggleClass("pressed");
				downButton.toggleClass("btn-danger");
			}

			if (button.hasClass('pressed')){		//unupvote
				pop_rating = pop_rating -1;
				Posts.update({_id: postID}, {$set : { pop_rating: pop_rating}});

			}else{		//upvote
				pop_rating = pop_rating + 1
				Posts.update({_id : postID},{$set : { pop_rating: pop_rating}});
			}

			button.toggleClass("pressed");
			//$('[name=upArrow'+this._id+']').removeClass("btn-default");
			button.toggleClass("btn-info");
		}
	},

	'click .downArrowButton': function(e){
		if(Meteor.user()) {
			var button = $('[name=downArrow' + this._id+']');
			var upButton = $('[name=upArrow'+this._id+']');

			var post = Posts.findOne({_id: this._id});
			var postID = post._id;
			var pop_rating = post.pop_rating;

			if (upButton.hasClass('pressed')){
				pop_rating = pop_rating - 1 ;
				Posts.update({_id:postID}, {$set : {pop_rating: pop_rating}});
				upButton.toggleClass("pressed");
				upButton.toggleClass("btn-info");
			}

			if (button.hasClass('pressed')){
				pop_rating = pop_rating +1 ;
				Posts.update({_id:postID}, {$set : {pop_rating: pop_rating}});
			}else {
				pop_rating = pop_rating -1;
				Posts.update({_id:postID}, {$set : {pop_rating: pop_rating}});
			}

			button.toggleClass("pressed");
			//$('[name=downArrow'+this._id+']').removeClass("btn-default");
			button.toggleClass("btn-danger");
		}
	}

});
