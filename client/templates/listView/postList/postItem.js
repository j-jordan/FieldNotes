Template.postItem.helpers({
	'getUserName': function(userID) {
    	return Meteor.users.findOne(userID).username;
    },

    'getTopSummary': function(pageID){
    	var summaryID = Post_summary.findOne({postID: pageID}).summaryID;
		return Summaries.findOne({_id: summaryID}).text;
    }

});

Template.postItem.events({

	'click .upArrowButton': function(e){
		var button = $('[name=upArrowButton]');
		var post = Posts.findOne({_id : this._id});
		var postID = post._id;		
		var pop_rating =post.pop_rating;

		if (button.hasClass('pressed')){		//unupvote
			pop_rating = pop_rating -1;
			Posts.update({_id: postID}, {$set : { pop_rating: pop_rating}});

		}else{		//upvote
			pop_rating = pop_rating + 1;
			console.log(pop_rating);
			Posts.update({_id : postID},{$set : { pop_rating: pop_rating}});
		}

		button.toggleClass("pressed");
		$('[name=upArrow'+this._id+']').removeClass("btn-default");
		$('[name=upArrow'+this._id+']').toggleClass("btn-info");
	},

	'click .downArrowButton': function(e){
		var button = $('[name=downArrowButton]');
		var post = Posts.findOne({_id: this._id});
		var postID = post._id;
		var pop_rating = post.pop_rating;

		if (button.hasClass('pressed')){
			pop_rating = pop_rating +1 ;
			Posts.update({_id:postID}, {$set : {pop_rating: pop_rating}});
		}else {
			pop_rating = pop_rating -1;
			Posts.update({_id:postID}, {$set : {pop_rating: pop_rating}});
		}

		button.toggleClass("pressed");
		$('[name=downArrow'+this._id+']').removeClass("btn-default");
		$('[name=downArrow'+this._id+']').toggleClass("btn-danger");
	}

});
