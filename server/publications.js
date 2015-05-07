//Server file containing all publications for collections.


//Publish for posts lists
Meteor.publish("Posts", function(){
	return Posts.find({});
});

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
	var post_summary_IDs = Post_summary.find({postID: _postID}, {fields: {summaryID: 1}}).fetch();

	var summaryIDsArray = [];

	for (var i = post_summary_IDs.length - 1; i >= 0; i--) {
		summaryIDsArray.push(post_summary_IDs[i].summaryID);
	};

	return Summaries.find({_id: {$in: summaryIDsArray}});
});

//Publish the comments for a given post
Meteor.publish("getComments", function(_postID){
	return Comments.find({postID: _postID});
});

//Publish the terms for a given post
Meteor.publish('terms', function(_postID){

	//Find all used term ids for the passed in postId
    var termUsedIdArray = Post_terms_used.find({postID: _postID}, {fields: {termID: 1}}).fetch();

    //Find all defined term ids for
    var termDefinedIdArray = Post_terms_defined.find({postID: _postID}, {fields: {termID: 1}}).fetch();

    var termArray = [];
    
    //Strip the __proto__ object
    for (var i = termUsedIdArray.length - 1; i >= 0; i--) {
    	//Push the terms used 
        termArray.push(termUsedIdArray[i].termID);
    };

    for (var i = termDefinedIdArray.length - 1; i >= 0; i--) {
    	//Push the terms defined
    	termArray.push(termDefinedIdArray[i].termID);
    };

    //Return all terms either used or defined
    return Terms.find({_id: {$in: termArray}});
});

//Publish the terms used by a given post
Meteor.publish('terms_used', function(_postID){
    return Post_terms_used.find({postID: _postID}, {fields: {termID: 1}});
});

//Publish the terms defined by a given post
Meteor.publish('terms_defined', function(_postID){
    return Post_terms_defined.find({postID: _postID}, {fields: {termID: 1}});
});

//Publish the dictionaries
Meteor.publish('dictionaries', function(){
    return Dictionaries.find();
});

//Publish the terms for a dictionary
Meteor.publish('dictionaryPageTerms', function(_dictionaryID) {
    return Terms.find({dictionaryID: _dictionaryID});    
});

//Publish the terms
Meteor.publish('termPageTerms', function(){
    return Terms.find({});
})

//Publish the admin term fields for a dictionary
Meteor.publish('admin_fields', function(_dictionaryID){
    var dictId = _dictionaryID;

    var adminLabelIDs = Admin_term_fields.find({dictionaryID: dictId}, {fields: {'AdminlabelsID': 1}}).fetch();

    label = [];

    for (var i = adminLabelIDs.length - 1; i >= 0; i--) {
        label.push(adminLabelIDs[i]['AdminlabelsID']);
    }

    return Adminlabels.find({_id: {$in: label}});
});

//Publish the label values for a term
Meteor.publish('labelValuesForTerms', function(_termID){
    return Term_label_values.find({termID: _termID});
});

//Publish all the definitions for the terms_defined
Meteor.publish('allTermDefinitions', function(termID){

    var definitionID = Term_definition.find({termID: termID}).fetch();

    var definitions = [];
    for (var i = definitionID.length - 1; i >= 0; i--) {    
        definitions.push(definitionID[i].definitionID);
    }

    return Definitions.find({_id: {$in: definitions}});
});

//Publish all the categories
Meteor.publish('categories', function(){
    return Categories.find({});
});