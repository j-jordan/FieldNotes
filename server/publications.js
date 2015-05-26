//Server file containing all publications for collections.


//Publish for posts lists
Meteor.publish("Posts", function(){
	return Posts.find({});
});

//Publish the matching post
Meteor.publish('Post', function(_postID){
    return Posts.find({_id: _postID});
})

//Publish for all users who have made a post. 
Meteor.publish("getUserNames", function(){

	var userIDs = Posts.find({}, {fields: {userID: 1}}).fetch();

	var userIDsArray = [];

	for (var i = userIDs.length - 1; i >= 0; i--) {
		userIDsArray.push(userIDs[i].userID);	
	};

	return Meteor.users.find({_id: {$in: userIDsArray}}, {fields: {username :1}});
});

//Publish the summaries for a given post
Meteor.publish("getSummaries", function(_postID){
	return Summaries.find({postID: _postID});
});

//Publish the comments for a given post
Meteor.publish("getComments", function(_postID){
	return Comments.find({postID: _postID});
});

//Publish the terms defined for a given post
Meteor.publish('terms_defined', function(_postID){
    //Find all defined term ids for
    var termDefinedIdArray = Posts.findOne(_postID).definedTermIDArray;

    //Return all terms either used or defined
    return Terms.find({_id: {$in: termDefinedIdArray}});
});

//Publish the terms used for a given post
Meteor.publish('terms_used', function(_postID){
	//Find all used term ids for the passed in postId
    var termUsedIdArray = Posts.findOne(_postID).usedTermIDArray;

    //Return all terms either used or defined
    return Terms.find({_id: {$in: termUsedIdArray}});
});

//Publish the dictionaries
Meteor.publish('dictionaries', function(){
    return Dictionaries.find();
});

//Publish the terms for a dictionary
Meteor.publish('dictionaryPageTerms', function(_dictionaryID) {
    return Terms.find({dictionaryID: _dictionaryID});    
});

//Publish the terms for a termPage
Meteor.publish('term', function(_termID){
    return Terms.find({_id: _termID});
})

//Publish the terms
Meteor.publish('termPageTerms', function(){
    return Terms.find({});
})

//Publish the admin term fields for a dictionary
Meteor.publish('adminLabels', function(_dictionaryID){
    return Adminlabels.find({dictionaryID: _dictionaryID});
});

//Publish the label values for a term
Meteor.publish('labelValuesForTerms', function(_termID){
    return Term_label_values.find({termID: _termID});
});

//Publish all the definitions for the term ID
Meteor.publish('allTermDefinitions', function(_termID){
    return Definitions.find({termID: _termID});
});

//Publish all the categories
Meteor.publish('categories', function(){
    return Categories.find({});
});

//Publish all the summaries for summary lists
Meteor.publish('summaries', function(){
    return Summaries.find({});
});

//Publish the post for a given summaryID
Meteor.publish('postFromSummaryID', function(_summaryID){
	var summary = Summaries.findOne({_id: _summaryID});
	
	if (typeof summary === 'undefined')  {
		console.log("WARN: 'postFromSummaryID': _summaryID was not in database, doing nothing.");
		return null;
	}
	
	var post_id = summary.postID;
	
    return Posts.find({_id: post_id});
});

//Publish the list of searchable terms
Meteor.publish('searchableTerms', function(){
    return Terms.find({});
});

//Publish the summaries based upon category id
Meteor.publish('summariesByCategory', function(_categoryID){

    var posts = Posts.find({categoryID: _categoryID}).fetch();

    var postIDs = [];

    for (var i = posts.length - 1; i >= 0; i--) {
        postIDs.push(posts[i]._id);
    };

    return Summaries.find({postID: {$in: postIDs}});
});
