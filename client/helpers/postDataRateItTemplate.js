Template.postDataRateItTemplate.helpers({
	'loggedIn': function(){
		if(Meteor.user())
		    return true;
		else 
	 	   return false;
	}
})