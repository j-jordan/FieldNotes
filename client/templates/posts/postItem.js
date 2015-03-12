Template.postItem.helpers({
	'getUserName': function(userID) {
    	return Users.find({_id : userID}).fetch()[0]['username'];
    }

});