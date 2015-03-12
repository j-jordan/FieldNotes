if(Users.find().count() === 0) {
	Users.insert({
		email : 'user1@Users.com',	
		password : "password",
		username : "alanTurn323",
		date_joined : "3/1/2015"
	});
	Users.insert({
        email : 'user2@Users.com',      
    	password : "password",
    	username : "gHopper1944",
    	date_joined : "3/1/2015"
    });
	Users.insert({
    	email : 'user3@Users.com',      
    	password : "password",
        username : "BabbageC415",
    	date_joined : "3/1/2015"
    });
}
var UsersData = Users.find().fetch();


if(Terms.find().count() === 0) {
	Terms.insert({
		term_name : 'Binary Tree',
		definition : 'A tree data structure in which each node has at most two children, which are referred to as the left child and the right child.'
	});
	Terms.insert({
		term_name : 'Variable',
		definition : 'Something used to hold a value.'
	});
	Terms.insert({
		term_name : 'Proof by contradiction',
		definition : 'A form of indirect proof, that establishes the truth or validity of a proposition by showing that the proposition\'s being false would imply a contradiction.'
	});
	Terms.insert({
		term_name : 'Proof by induction',
		definition : '+1'
	});
}
var TermsData = Terms.find().fetch();


if(Categories.find().count() === 0) {
	Categories.insert({
		category_name: 'Algorithms',
		parentID : 0
	});
	Categories.insert({
		category_name : 'NP',
		parentID : Categories.find().fetch()[0]['_id']
	});
	Categories.insert({
		category_name : 'Artificial Intelligence',
		parentID : Categories.find().fetch()[0]['_id']
	});
	Categories.insert({
		category_name : 'Data Structures',
		parentID : 0
	});
	Categories.insert({
		category_name : 'Discrete Math',
		parentID : 0
	});
	Categories.insert({
		category_name : 'Trees',
		parentID : Categories.find().fetch()[3]['_id']
	});
}
var CategoriesData = Categories.find().fetch();


if(Posts.find().count() === 0) {
	Posts.insert({
		userID : UsersData[0]['_id'],
		title : "This and That, Algorithms united.",
		pop_rating : '29',
		quality_rating : '4',
		doi : '12423' ,
		author : "Thom Yorke",
		publish_date : "7/4/2010",
		categoryID : Categories.find().fetch()[0]['_id']
	});
	Posts.insert({
		userID : UsersData[1]['_id'],
		title : "Why Discreet Math changed my life.",
		pop_rating : '67',
		quality_rating : '3',
		doi : '6789' ,
		author : "Elon Musk",
		publish_date : "7/5/2010",
		categoryID : Categories.find().fetch()[4]['_id']
	});
	Posts.insert({
		userID : UsersData[2]['_id'],
		title : "GLICKO: made easy.",
		pop_rating : '29',
		quality_rating : '4',
		doi : '12423' ,
		author : "Jane Goodall",
		publish_date : "7/2/2010",
		categoryID : Categories.find().fetch()[1]['_id']

	});
}
var PostsData = Posts.find().fetch();


if(Comments.find().count() === 0) {
	Comments.insert({
		userID : UsersData[0]['_id'],
		parentID : '0', //No parent
		postID : PostsData[0]['_id'],
		rating : '4',
		text : "This is the coolest paper ever. amirite?",
		date : "3/2/2015"
	});
	Comments.insert({
    	userID : UsersData[1]['_id'],
    	parentID : Comments.find().fetch()[0]['_id'],
    	postID : PostsData[0]['_id'],
    	rating : '1',
    	text : "N0pe. You think these sources are scholarly?",
    	date : "3/2/2015"
	});	
	Comments.insert({
    	userID : UsersData[0]['_id'],
    	parentID : Comments.find().fetch()[1]['_id'],
    	postID : PostsData[0]['_id'],
    	rating : '5',
    	text : "Science has put Wikipedia to the test, it is the irrefutable all-source. You can't escape it.",
    	date : "3/2/2015"
	});
	Comments.insert({
        userID : UsersData[2]['_id'],
    	parentID : Comments.find().fetch()[0]['_id'],
    	postID : PostsData[0]['_id'],
    	rating : '4',
    	text : "You are right. Hail Wiki.",
    	date : "3/2/2015"
	});
	Comments.insert({
    	userID : UsersData[2]['_id'],
    	parentID : '0', //No parent
    	postID : PostsData[0]['_id'],
    	rating : '3',
    	text : "This is what I've been looking for.",
    	date : "3/3/2015"
	});
}
var CommentsData = Comments.find().fetch();


if(Summaries.find().count() === 0) {
	Summaries.insert({
		userID : UsersData[0]['_id'],
		text : "In general, this paper explains the connection between this and that.",
		rating : '3' 
	});
	Summaries.insert({	
		userID : UsersData[1]['_id'],
        text : "3 Dimensional Shadow: A shadow cast by a 4 dimensional object.",
        rating : '4.3'
	}); 	
	Summaries.insert({
		userID : UsersData[2]['_id'],
		text: "THIS IS A SUMMARY.",
		rating : '1'
	});
}
var SummaryData = Summaries.find().fetch();


if(Adminlabels.find().count() === 0) {
	Adminlabels.insert({
		label : 'Running time big-O',
		description : 'Running time is required for this term to be added to this dictionary'
	});
	Adminlabels.insert({
		label : 'Running time little-O',
		description : 'Running time is required for this term to be added to this dictionary'
	});
}
var AdminLabelsData = Adminlabels.find().fetch();


/****************
*               *
* PIVOT TABLES  *
*               *
****************/

//Terms defined pivot tables
if(Post_terms_defined.find().count() === 0) {
	Post_terms_defined.insert({
		postID : PostsData[0]['_id'],
		termID : TermsData[0]['_id']
	});
	Post_terms_defined.insert({
    	postID : PostsData[1]['_id'],
    	termID : TermsData[1]['_id']
    });
	Post_terms_defined.insert({
    	postID : PostsData[1]['_id'],
    	termID : TermsData[2]['_id']
    });
	Post_terms_defined.insert({
    	postID : PostsData[2]['_id'],
    	termID : TermsData[3]['_id']
    });	
}

//Terms used pivot tables
if(Post_terms_used.find().count() === 0) {
	Post_terms_used.insert({
		postID : PostsData[0]['_id'],
		termID : TermsData[0]['_id']
	});
	Post_terms_used.insert({
        postID : PostsData[0]['_id'],
        termID : TermsData[1]['_id']
    });
    Post_terms_used.insert({
        postID : PostsData[0]['_id'],
        termID : TermsData[2]['_id']
    });
	Post_terms_used.insert({
        postID : PostsData[1]['_id'],
        termID : TermsData[3]['_id']
    });
}

//admin fields pivot table
if(Admin_term_fields.find().count() === 0) {
	Admin_term_fields.insert({
		termID : TermsData[0]['_id'],
		AdminlabelsID : AdminLabelsData[0]['_id']
	});
	Admin_term_fields.insert({
		termID : TermsData[0]['_id'],
		AdminlabelsID : AdminLabelsData[1]['_id']
	});	
}

//Summaries pivot table
if(Post_summary.find().count() === 0) {
	Post_summary.insert({
		postID : PostsData[0]['_id'],
		summaryID : SummaryData[0]['_id']
	});
	Post_summary.insert({
		postID : PostsData[0]['_id'],
		summaryID : SummaryData[1]['_id']
	});
	Post_summary.insert({
		postID : PostsData[1]['_id'],
		summaryID : SummaryData[2]['_id']
	});
} 