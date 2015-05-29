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
	check(_postID, String);
    return Posts.find({_id: _postID});
});

Meteor.publish('lookupUsername', function(_userID){
	check(_userID, String);
	return Meteor.users.find(_userID, {fields: {username :1}});
});

Meteor.publish('lookupDictionary', function(_dictionaryID){
	check(_dictionaryID, String);
    return Dictionaries.find({_id: _dictionaryID});
});

//Publish the terms for a termPage
Meteor.publish('lookupTerm', function(_termID){
	check(_termID, String);
    return Terms.find({_id: _termID});
});

//Publish the summary for a given summaryID
Meteor.publish('lookupSummary', function(_summaryID){
	check(_summaryID, String);
	return Summaries.find({_id: _summaryID});
});

/****************
*   DOCUMENT    *
*  BY PROPERTY  *
****************/

Meteor.publish('getDictionaryByName', function(_name){
	check(_name, String);
    return Dictionaries.find({name: _name});
});

/****************
*   DOCUMENTS   *
*      BY       *
*  FOREIGN KEY  *
****************/

//Publish the summaries for a given post
Meteor.publish('getSummariesFromPostID', function(_postID){
	check(_postID, String);
	return Summaries.find({postID: _postID});
});

//Publish the comments for a given post
Meteor.publish('getCommentsFromPostID', function(_postID){
	check(_postID, String);
	return Comments.find({postID: _postID});
});

//Publish the terms defined for a given post
Meteor.publish('getTermsFromPostID', function(_postID){
	check(_postID, String);
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
	check(_dictionaryID, String);
    return Terms.find({dictionaryID: _dictionaryID});
});

//Publish the admin term fields for a dictionary
Meteor.publish('getAdminlabelsFromDictionaryID', function(_dictionaryID){
	check(_dictionaryID, String);
    return Adminlabels.find({dictionaryID: _dictionaryID});
});

//Publish the label values for a term
Meteor.publish('getLabelValuesFromTermIDAndAdminlabelsID', function(_termID, _adminlabelsID){
	check(_termID, String);
	check(_adminlabelsID, String);
    return Term_label_values.find({termID: _termID, adminlabelsID: _adminlabelsID});
});

//Publish all the definitions for the term ID
Meteor.publish('getDefinitionsFromTermID', function(_termID){
	check(_termID, String);
    return Definitions.find({termID: _termID});
});

//Publish the summaries based upon category id
Meteor.publish('getSummariesFromCategoryID', function(_categoryID){
	check(_categoryID, String);

    var posts = Posts.find({categoryID: _categoryID}).fetch();

    var postIDs = [];

    for (var i = posts.length - 1; i >= 0; i--) {
        postIDs.push(posts[i]._id);
    };

    return Summaries.find({postID: {$in: postIDs}});
});

Meteor.publish('getPostsFromCategoryID', function(_categoryID){
	check(_categoryID, String);
	return Posts.find({categoryID: _categoryID});
});

/****************
* DOCUMENT SETS *
****************/
// All documents needed to render the layout template
Meteor.publish('retrieveLayout', function() {
    return Categories.find({parentID: 0}); // All top-level categories
});

// All documents needed to render a postsList template
Meteor.publish('retrievePostsList', function() {
    var postsCursor = Posts.find({});
	var cursors = [
		postsCursor, // All posts
	];

    var summaryIDs = [];
	var userIDs = [];
	postsCursor.forEach(function(post) {
		Summaries.find({postID: post._id}, { sort: {rating: -1}, limit:1 }).forEach(function(summary) {
			summaryIDs.push(summary._id);
		});
		userIDs.push(post.userID);
	});
	cursors.push(Summaries.find({_id: {$in: summaryIDs}})); // Top summary for each post
	cursors.push(Meteor.users.find({_id: {$in: userIDs} }, {fields: {username :1}})); // Usernames of user for each post

    return cursors;
});

// All documents needed to render a postPage template
Meteor.publish('retrievePostPage', function(_postID) {
	check(_postID, String);

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

// All documents needed to render a categoryPage template
Meteor.publish('retrieveCategoryPage', function(_categoryName) {
	check(_categoryName, String);

	var category = Categories.findOne({category_name: _categoryName});
	var cursors = [
		Categories.find({category_name: _categoryName}), // The category itself
	];

	if (category) {
		var postCursor = Posts.find({categoryID: category._id});
		cursors.push(postCursor); // All posts in the category

		var posts = postCursor.fetch();
		var userIDs = [];
		var summaryIDs = [];
		for (i = 0; i < posts.length; i++) {
			userIDs.push(posts[i].userID);

			var summary = Summaries.findOne({postID: posts[i]._id}, { sort: {rating: -1}});
			if (summary) {
				summaryIDs.push(summary._id);
			}
		}

		cursors.push(Meteor.users.find({_id: {$in: userIDs} }, {fields: {username :1}})); // Username of user for post
		cursors.push(Summaries.find({_id: {$in: summaryIDs}})); // Top summary for each post in the category
	}

	return cursors;
});

// All documents needed to render a termPage template
Meteor.publish('retrieveTermPage', function(_termID) {
	check(_termID, String);

	var term = Terms.findOne({_id: _termID});
	var cursors = [
		Terms.find({_id: _termID}), // The term itself
	];

	if (term) {
		var labelCursor = Adminlabels.find({dictionaryID: term.dictionaryID})
		cursors.push(labelCursor); // The Adminlabels for the term's dictionary

		var labelValueIDs = [];
		labelCursor.forEach(function(label) {
			Term_label_values.find({termID: term._id, adminlabelsID: label._id}).forEach(function(value) {
				labelValueIDs.push(value._id);
			});
		});

		cursors.push(Term_label_values.find({_id: {$in: labelValueIDs}})); // The values of each Adminlabel for the term

		cursors.push(Definitions.find({termID: _termID})); // All definitions for the term
	}

	return cursors;
});

// All documents needed to render a newTerm template
Meteor.publish('retrieveNewTerm', function(_dictName) {
	check(_dictName, String);

	var dictionary = Dictionaries.findOne({name: _dictName});
	var cursors = [
		Dictionaries.find({name: _dictName}), // The dictionary itself
	];

	if (dictionary) {
		var labelCursor = Adminlabels.find({dictionaryID: dictionary._id})
		cursors.push(labelCursor); // The Adminlabels for the dictionary
	}

	return cursors;
});

// All documents needed to render a summaryList template
Meteor.publish('retrieveSummaryList', function() {
    var postsCursor = Posts.find({});
	var cursors = [
		postsCursor, // All posts
	];

    var postIDs = [];
	var userIDs = [];
	postsCursor.forEach(function(post) {
		postIDs.push(post._id);
		userIDs.push(post.userID);
	});
	cursors.push(Summaries.find({postID: {$in: postIDs}})); // All summaries for each post
	cursors.push(Meteor.users.find({_id: {$in: userIDs} }, {fields: {username :1}})); // Usernames of user for each post

    return cursors;
});

// All documents needed to render a summaryListByCategory template
Meteor.publish('retrieveSummaryListByCategory', function(_categoryID) {
	check(_categoryID, String);

    var postsCursor = Posts.find({categoryID: _categoryID});
	var cursors = [
		postsCursor, // All posts in the category
	];

    var postIDs = [];
	var userIDs = [];
	postsCursor.forEach(function(post) {
		postIDs.push(post._id);
		userIDs.push(post.userID);
	});
	cursors.push(Summaries.find({postID: {$in: postIDs}})); // All summaries for each post
	cursors.push(Meteor.users.find({_id: {$in: userIDs} }, {fields: {username :1}})); // Usernames of user for each post

    return cursors;
});
