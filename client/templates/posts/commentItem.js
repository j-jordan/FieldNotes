Template.commentItem.helpers({
    'findUser': function(userID) {
    	return Meteor.users.findOne({_id : userID}).username;
    }
});