Template.commentSubmit.events({
    //Submit form for creating a comment
    'click [name=submitComment]': function(e, template) {
        //Update data. Some fields such as date still hardcoded.
        var $body = template.$('textarea[name=body]');

        var comment = {
            text: $body.val(),
            postID: template.data._id,
            parentID: 0,
            date: "3/27/2015",
            userID: Meteor.user()._id
        };

        //Insert the comment
        Comments.insert(comment);

        //Reset the comment box
        $body.val('');
    }
});
