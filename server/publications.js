//Server file containing all publications for collections.

/****************
*     LISTS     *
****************/

//Publish for posts lists
Meteor.publish('listAllPosts', function(){
	return Posts.find({});
});

//Publish the dictionaries
Meteor.publish('listAllDictionaries', function(){
    return Dictionaries.find({});
});

//Publish all the categories
Meteor.publish('listAllCategories', function(){
    return Categories.find({});
});

//Publish all the summaries for summary lists
Meteor.publish('listAllSummaries', function(){
    return Summaries.find({});
});

//Publish the list of searchable terms
Meteor.publish('listAllTerms', function(){
    return Terms.find({});
});

/****************
*   DOCUMENT    *
*     BY ID     *
****************/

//Publish the matching post
Meteor.publish('lookupPost', function(_postID){
    return Posts.find({_id: _postID});
})

Meteor.publish('lookupUsername', function(_userID){
	return Meteor.users.find(_userID, {fields: {username :1}});
});

//Publish the terms for a termPage
Meteor.publish('lookupTerm', function(_termID){
    return Terms.find({_id: _termID});
})

//Publish the summary for a given summaryID
Meteor.publish('lookupSummary', function(_summaryID){
	return Summaries.find({_id: _summaryID});
});

/****************
*   DOCUMENTS   *
*      BY       *
*  FOREIGN KEY  *
****************/

//Publish the summaries for a given post
Meteor.publish('getSummariesFromPostID', function(_postID){
	return Summaries.find({postID: _postID});
});

//Publish the comments for a given post
Meteor.publish('getCommentsFromPostID', function(_postID){
	return Comments.find({postID: _postID});
});

//Publish the terms defined for a given post
Meteor.publish('getTermsFromPostID', function(_postID){
    var termIdArray = Posts.findOne(_postID).definedTermIDArray;
	
	var termUsedIdArray = Posts.findOne(_postID).usedTermIDArray;
	for (i = 0; i < termUsedIdArray.length; i++) {
		termIdArray.push(termUsedIdArray[i]);
	}
	
    //Return all terms either used or defined
    return Terms.find({_id: {$in: termIdArray}});
});

//Publish the terms for a dictionary
Meteor.publish('getTermsFromDictionaryID', function(_dictionaryID) {
    return Terms.find({dictionaryID: _dictionaryID});
});

//Publish the admin term fields for a dictionary
Meteor.publish('getAdminlabelsFromDictionaryID', function(_dictionaryID){
    return Adminlabels.find({dictionaryID: _dictionaryID});
});

//Publish the label values for a term
Meteor.publish('getLabelValuesFromTermIDAndAdminlabelsID', function(_termID, _adminlabelsID){
    return Term_label_values.find({termID: _termID, adminlabelsID: _adminlabelsID});
});

//Publish all the definitions for the term ID
Meteor.publish('getDefinitionsFromTermID', function(_termID){
    return Definitions.find({termID: _termID});
});

//Publish the summaries based upon category id
Meteor.publish('getSummariesFromCategoryID', function(_categoryID){

    var posts = Posts.find({categoryID: _categoryID}).fetch();

    var postIDs = [];

    for (var i = posts.length - 1; i >= 0; i--) {
        postIDs.push(posts[i]._id);
    };

    return Summaries.find({postID: {$in: postIDs}});
});

Meteor.publish('getPostsFromCategoryID', function(_categoryID){
	return Posts.find({categoryID: _categoryID});
});

/****************
* DOCUMENT SETS *
****************/

// All documents needed to render a postPage template
Meteor.publish('retrievePostPage', function(_postID){
	var post = Posts.findOne({_id: _postID});
	var cursors = [
		Posts.find({_id: _postID}), // The post itself
		Summaries.find({postID: _postID}), // The summaries for the post
		Comments.find({postID: _postID}), // The comments for the post
		];
	
	var comments = Comments.find({postID: _postID}).fetch();
	var userIDs = [];
	for (i = 0; i < comments.length; i++) {
		userIDs.push(comments[i].userID); // UserID for comment submitter
	}
	if (post) {
		userIDs.push(post.userID); // UserID for post submitter
	}
	cursors.push(Meteor.users.find({_id: {$in: userIDs} }, {fields: {username :1}}));

	if (post) {
		var termIdArray = post.definedTermIDArray;
		for (i = 0; i < post.usedTermIDArray.length; i++) {
			termIdArray.push(post.usedTermIDArray[i]);
		}
		cursors.push(Terms.find({_id: {$in: termIdArray}})); // All terms either used or defined in the post
	}

	return cursors;
});
