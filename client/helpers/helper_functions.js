// 'loggedIn' global template function. Returns true if the user is logged in
Template.registerHelper('loggedIn', function(){
	if(Meteor.user())
		return true;
	else
		return false;
});