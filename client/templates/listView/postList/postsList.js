//Subscribe to the list of posts for the frontpage
Meteor.subscribe('Posts');

//Subscribe to the usernames who have posted a paper
Meteor.subscribe('getUserNames');

Template.postsList.helpers({
	Post: function(){ return Posts.find(); }
});