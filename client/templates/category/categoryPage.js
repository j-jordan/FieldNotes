Template.categoryPage.helpers({
    //Return the posts to be displayed
    'posts': function() {
        if (Template.instance().data.type == "category") {
            return Posts.find({
                'categoryID': Template.instance().data.object._id,
            });
        } else if (Template.instance().data.type == "tag") {
            var postIDs = [];
            Post_tags.find({'tag': Template.instance().data.object }).forEach(function(doc) {
                postIDs.push(doc.postID);
            });

            return Posts.find({
                '_id' : {
                    '$in' : postIDs,
                }
            });

        }
    }
});
