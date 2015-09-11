// 'loggedIn' global template function. Returns true if the user is logged in
Template.registerHelper('loggedIn', function() {
    if (Meteor.user()) {
        return true;
    } else {
        return false;
    }
});

Template.registerHelper('isAdmin', function(){
    if (Meteor.user()) {
        return Roles.userIsInRole(Meteor.user()._id,'admin');
    } else {
        return false;
    }
})
