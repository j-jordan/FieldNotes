//Router configurations
Router.configure({
	layoutTemplate: 'layout',
    loadingTemplate: 'loadingTemplate',
	onBeforeAction: function() {
		if (this.ready()) {
			this.next(); // If there is another hook, this function executes it. Otherwise, it executes the action
		} else {
			this.render('loadingTemplate');
		}
    },
});

// This plugin renders a specified template if a route has a defined 'data' function which returns undefined.
Router.plugin('dataNotFound', {notFoundTemplate: 'notFoundTemplate'});


//Route for homepage
Router.route('/', {
	name: 'postsList',
	waitOn: function(){
		//return Meteor.subscribe('posts');
	}
});

//Route for a post page when linked from postList
Router.route('/posts/:_id',{
	name: 'postPage',
	waitOn: function() {
		return Meteor.subscribe('retrievePostPage', this.params._id);
	},
	data: function() {
		return Posts.findOne(this.params._id);
	},
	action: function() {
		this.render();
	}
});

//Route for submiting a post
Router.route('/submit', {
	name: 'submitPage'
});

//Route for viewing the list of dictionaries
Router.route('/dictionary', {
	name: 'dictionaries',
	data: function() {return Dictionaries.find(); }
});

//Route for viewing a specific dictionary and the terms inside it
Router.route('/dictionary/:_id', {
	name: 'dictionaryPage',
	data: function() {return Dictionaries.findOne({_id: this.params._id}); }
});

//Route for viewing posts inside a specific category
Router.route('/category/:category_name', {
	name: 'categoryPage',
	data: function() {return Categories.findOne({category_name: this.params.category_name}); }
})

//Route for viewing a specific term
Router.route('/term/:_id', {
	name: 'termPage',
	data: function() {
		return Terms.findOne(this.params._id);
	} 
});

//Route for creating a new term in a dictionary
Router.route('/newTerm/:name', {
	name: 'newTerm',
	data: function() {return Dictionaries.findOne({name: this.params.name})}
});

//Route for creating a new dictionary
Router.route('/newdictionary' , {
	name: 'newDictionary'
});

//Route for submiting a new summary for a post
Router.route('/submitSummary/:submitSummaryID' , {
	name: 'submitSummary',
	data: function() { 
		return Posts.findOne(this.params.submitSummaryID);
	}
});	

//Route for viewing all summaries
Router.route('/summaryList' , {
	name: 'summaryList'
});

//Route for viewing all summaries inside a category
Router.route('category/:_id/summaryList', {

	name: 'summaryListByCategory',
	data: function() {
		return Categories.findOne(this.params._id);
	}
});

//Route for submiting a new definition for a dictionary term
Router.route('/submitDefinition/:_id', {
	name: 'submitDefinition',
	data: function() {return Terms.findOne(this.params._id)}
});


//Route for the search page
Router.route('/search/',{
	name: 'searchTemplate',
	waitOn: function() {
		Meteor.subscribe('listAllTerms');
	}
});
