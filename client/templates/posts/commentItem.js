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
		var button = $('[name=upArrowButton]');
		var comment = Comments.findOne({_id : this._id});
		var commentID = comment._id;		
		var pop_rating =comment.pop_rating;

		if (button.hasClass('pressed')){		//unupvote
			pop_rating = pop_rating -1;
			Comments.update({_id: commentID}, {$set : { pop_rating: pop_rating}});

		}else{		//upvote
			pop_rating = pop_rating + 1;
			console.log(pop_rating);
			Comments.update({_id : commentID},{$set : { pop_rating: pop_rating}});
		}

		button.toggleClass("pressed");
		$('[name=upArrow'+this._id+']').removeClass("btn-default");
		$('[name=upArrow'+this._id+']').toggleClass("btn-info");
	},

	'click .downArrowButton': function(e){
		var button = $('[name=downArrowButton]');
		var comment = Comments.findOne({_id: this._id});
		var commentID = comment._id;
		var pop_rating = comment.pop_rating;

		if (button.hasClass('pressed')){
			pop_rating = pop_rating +1 ;
			Comments.update({_id:commentID}, {$set : {pop_rating: pop_rating}});
		}else {
			pop_rating = pop_rating -1;
			Comments.update({_id:commentID}, {$set : {pop_rating: pop_rating}});
		}

		button.toggleClass("pressed");
		$('[name=downArrow'+this._id+']').removeClass("btn-default");
		$('[name=downArrow'+this._id+']').toggleClass("btn-danger");
	}

});