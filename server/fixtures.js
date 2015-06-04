if(Meteor.users.find().count() === 0) {

    var jeremy = Accounts.createUser({
        username: 'jeremy',
        email: 'jjordan@gmail.com',
        password: 'password',
        profile : {
            name: 'jeremy'
        }
    });

    Roles.setUserRoles(jeremy,'admin');

    var dillon = Accounts.createUser({
        username: 'dillon',
        email: 'dillon@gmail.com',
        password: 'password',
        profile : {
            name: 'dillon'
        }
    });

    Roles.setUserRoles(dillon,'admin');

    var kendall = Accounts.createUser({
        username: 'kendall',
        email: 'kendall@gmail.com',
        password: 'password',
        profile : {
            name: 'kendall'
        }
    });

    Roles.setUserRoles(kendall,'admin');

    var guest = Accounts.createUser({
        username: 'guest',
        email: 'guest@gmail.com',
        password: 'password',
        profile : {
            name: 'guest'
        }
    });

    Roles.setUserRoles(guest,'guest');
}
var UsersData = Meteor.users.find().fetch();

if(Dictionaries.find().count() === 0) {
    Dictionaries.insert({
        name: 'Algorithms'
    });
    Dictionaries.insert({
        name: 'Data Structures'
    });
    Dictionaries.insert({
        name: 'Artificial Intelligence'
    });
    Dictionaries.insert({
        name: 'Discrete Math'
    });
}
var DictionaryData = Dictionaries.find().fetch();

if(Terms.find().count() === 0) {
    Terms.insert({
        term_name : 'Binary Tree',
        dictionaryID : Dictionaries.find().fetch()[0]['_id']
    });
    Terms.insert({
        term_name : 'Variable',
        dictionaryID : Dictionaries.find().fetch()[1]['_id']
    });
    Terms.insert({
        term_name : 'Proof by contradiction',
        dictionaryID : Dictionaries.find().fetch()[3]['_id']
    });
    Terms.insert({
        term_name : 'Proof by induction',
        dictionaryID : Dictionaries.find().fetch()[2]['_id']
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
        pop_rating : 29,
        quality_rating : 4,
        numRaters : 20,
        doi : '12423' ,
        author : "Thom Yorke",
        publisher : "Kendrick Lamar",
        publish_date : "7/4/2010",
        categoryID : Categories.find().fetch()[0]['_id'],
        definedTermIDArray : [ TermsData[0]['_id'] ],
        usedTermIDArray : [ TermsData[1]['_id'] ]
    });
    Posts.insert({
        userID : UsersData[1]['_id'],
        title : "Why Discreet Math changed my life.",
        pop_rating : 67,
        quality_rating : 3,
        numRaters : 15,
        doi : '6789' ,
        author : "Elon Musk",
        publisher : "Tree House",
        publish_date : "7/5/2010",
        categoryID : Categories.find().fetch()[4]['_id'],
        definedTermIDArray : [ TermsData[1]['_id'], TermsData[2]['_id'] ],
        usedTermIDArray : [ TermsData[2]['_id'] ]
    });
    Posts.insert({
        userID : UsersData[2]['_id'],
        title : "GLICKO: made easy.",
        pop_rating : 29,
        quality_rating : 4,
        numRaters : 10,
        doi : '12423' ,
        author : "Jane Goodall",
        publisher : "Kony 2012",
        publish_date : "7/2/2010",
        categoryID : Categories.find().fetch()[1]['_id'],
        definedTermIDArray : [ TermsData[3]['_id'] ],
        usedTermIDArray : [ TermsData[1]['_id'] ]
    });
}
var PostsData = Posts.find().fetch();


if(Comments.find().count() === 0) {
    Comments.insert({
        userID : UsersData[0]['_id'],
        parentID : '0', //No parent
        postID : PostsData[0]['_id'],
        pop_rating : 4,
        text : "This is the coolest paper ever. amirite?",
        date : "3/2/2015"
    });
    Comments.insert({
        userID : UsersData[1]['_id'],
        parentID : Comments.find().fetch()[0]['_id'],
        postID : PostsData[0]['_id'],
        pop_rating : 1,
        text : "N0pe. You think these sources are scholarly?",
        date : "3/2/2015"
    });
    Comments.insert({
        userID : UsersData[0]['_id'],
        parentID : Comments.find().fetch()[1]['_id'],
        postID : PostsData[0]['_id'],
        pop_rating : 5,
        text : "Science has put Wikipedia to the test, it is the irrefutable all-source. You can't escape it.",
        date : "3/2/2015"
    });
    Comments.insert({
        userID : UsersData[2]['_id'],
        parentID : Comments.find().fetch()[0]['_id'],
        postID : PostsData[0]['_id'],
        pop_rating : 4,
        text : "You are right. Hail Wiki.",
        date : "3/2/2015"
    });
    Comments.insert({
        userID : UsersData[2]['_id'],
        parentID : '0', //No parent
        postID : PostsData[0]['_id'],
        pop_rating : 3,
        text : "This is what I've been looking for.",
        date : "3/3/2015"
    });
}

var CommentsData = Comments.find().fetch();

if(Summaries.find().count() === 0) {
    Summaries.insert({
        userID : UsersData[0]['_id'],
        postID : PostsData[0]['_id'],
        text : "In general, this paper explains the connection between this and that.",
        quality_rating : 3,
        numRaters : 2
    });
    Summaries.insert({
        userID : UsersData[1]['_id'],
        postID : PostsData[0]['_id'],
        text : "3 Dimensional Shadow: A shadow cast by a 4 dimensional object.",
        quality_rating : 4.3,
        numRaters : 4
    });
    Summaries.insert({
        userID : UsersData[2]['_id'],
        postID : PostsData[1]['_id'],
        text: "THIS IS A SUMMARY.",
        quality_rating : 1,
        numRaters : 6
    });
    Summaries.insert({
        userID : UsersData[2]['_id'],
        postID : PostsData[2]['_id'],
        text: "Test.",
        quality_rating : 4.2,
        numRaters : 6
    });
}
var SummaryData = Summaries.find().fetch();

if(Definitions.find().count() === 0) {
    Definitions.insert({
        termID : TermsData[0]['_id'],
        userID : UsersData[0]['_id'],
        text : "A tree data structure in which each node has at most two children, which are referred to as the left child and the right child.",
        quality_rating : 5,
        numRaters : 10
    });
    Definitions.insert({
        termID : TermsData[0]['_id'],
        userID : UsersData[2]['_id'],
        text : "1s and 0s that grow trunks ad leaves",
        quality_rating : 1,
        numRaters : 5
    });
    Definitions.insert({
        termID : TermsData[1]['_id'],
        userID : UsersData[1]['_id'],
        text : 'Something used to hold a value.',
        quality_rating : 5,
        numRaters : 2
    });
    Definitions.insert({
        termID : TermsData[2]['_id'],
        userID : UsersData[0]['_id'],
        text : 'A form of indirect proof, that establishes the truth or validity of a proposition by showing that the proposition\'s being false would imply a contradiction.',
        quality_rating : 4,
        numRaters : 6
    });
    Definitions.insert({
        termID : TermsData[3]['_id'],
        userID : UsersData[0]['_id'],
        text : '+1',
        quality_rating : 3,
        numRaters : 1
    });
}

var DefinitionData = Definitions.find().fetch();


if(Adminlabels.find().count() === 0) {
    Adminlabels.insert({
        dictionaryID : DictionaryData[0]['_id'],
        label : 'Running time big-O',
        description : 'Running time is required for this term to be added to this dictionary'
    });
    Adminlabels.insert({
        dictionaryID : DictionaryData[0]['_id'],
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

if(Term_label_values.find().count() === 0) {
    Term_label_values.insert({
        termID : TermsData[0]['_id'],
        adminlabelsID : AdminLabelsData[0]['_id'],
        value : "n^2"
    });
    Term_label_values.insert({
        termID : TermsData[0]['_id'],
        adminlabelsID : AdminLabelsData[1]['_id'],
        value : "log(n)"
    });
}
