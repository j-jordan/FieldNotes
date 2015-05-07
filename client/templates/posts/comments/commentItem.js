Template.commentItem.helpers({
    'findUser': function(userID) {
    	return Meteor.users.findOne({_id : userID}).username;
    },
	'isAdmin' : function(){
		if(Meteor.user()){
			if(!Roles.userIsInRole(Meteor.user()._id,'admin')){
				return 'hidden';
			}
		} else {
			return 'hidden';
		}
	}
});

Template.commentItem.events({

	'click .upArrowButton': function(e){
		if(Meteor.user()) {
			var button = $('[name=upArrow'+this._id+']');
			var downButton = $('[name=downArrow'+this._id+']');

			var comment = Comments.findOne({_id : this._id});
			var commentID = comment._id;		
			var pop_rating =comment.pop_rating;

			if (downButton.hasClass('pressed')){
				pop_rating = pop_rating + 1;
				Posts.update({_id:commentID}, {$set : {pop_rating: pop_rating}});
				downButton.toggleClass("pressed");
				downButton.toggleClass("btn-danger");
			}

			if (button.hasClass('pressed')){		//unupvote
				pop_rating = pop_rating -1;
				Comments.update({_id: commentID}, {$set : { pop_rating: pop_rating}});

			}else{		//upvote
				pop_rating = pop_rating + 1;
				console.log(pop_rating);
				Comments.update({_id : commentID},{$set : { pop_rating: pop_rating}});
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

			var comment = Comments.findOne({_id: this._id});
			var commentID = comment._id;
			var pop_rating = comment.pop_rating;

			if (upButton.hasClass('pressed')){
				pop_rating = pop_rating - 1 ;
				Comments.update({_id:commentID}, {$set : {pop_rating: pop_rating}});
				upButton.toggleClass("pressed");
				upButton.toggleClass("btn-info");
			}

			if (button.hasClass('pressed')){
				pop_rating = pop_rating +1 ;
				Comments.update({_id:commentID}, {$set : {pop_rating: pop_rating}});
			}else {
				pop_rating = pop_rating -1;
				Comments.update({_id:commentID}, {$set : {pop_rating: pop_rating}});
			}

			button.toggleClass("pressed");
			//$('[name=downArrow'+this._id+']').removeClass("btn-default");
			button.toggleClass("btn-danger");
		}
	}

});