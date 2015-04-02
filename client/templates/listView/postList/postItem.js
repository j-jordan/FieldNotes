Template.postItem.helpers({
	'getUserName': function(userID) {
    	return Meteor.users.findOne(userID).username;
    }

});


