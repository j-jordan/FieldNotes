Meteor.subscribe('Posts');
Meteor.subscribe('getUserNames');

Template.postsList.helpers({
	Post: function(){ return Posts.find(); }
});