Template.rateitTemplate.rendered = function() {
	this.$('.rateit').rateit();
};

Template.uneditableRateItTemplate.rendered = function() {
	this.$('.rateit').rateit();
};

Template.rateitTemplate.helpers({

	'loggedIn': function(){
		if(Meteor.user())
            return true;
        else 
            return false;
	}
})