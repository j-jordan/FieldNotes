// 'loggedIn' global template function. Returns true if the user is logged in
Template.registerHelper('loggedIn', function(){
	if(Meteor.user())
		return true;
	else
		return false;
});

Template.registerHelper('isAdmin', function(){
	if(Meteor.user()){
		if(!Roles.userIsInRole(Meteor.user()._id,'admin')){
			return 'hidden';
		}
	} 
    else {
		return 'hidden';
	}
})