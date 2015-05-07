Meteor.subscribe('Posts');
Meteor.subscribe('getUserNames');

Template.postsList.helpers({
	Post: function(){console.log(Posts.find().fetch()); return Posts.find(); }
});