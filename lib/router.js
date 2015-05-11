Router.configure({
	layoutTemplate: 'layout',
	waitOn: function() {
		// return Meteor.subscribe('userData');
	}
});

Router.route('/', {
	name: 'postsList',
	waitOn: function(){
		//return Meteor.subscribe('posts');
	}
});

Router.route('/posts/:_id',{
	name: 'postPage',
	data: function() {
		var posts = Posts.findOne(this.params._id);
		
		var templateData = {
			postData: posts,
			submitSummaryID: posts._id
		}

		return templateData;
	}
});

Router.route('/post/:_id',function(){
	this.render('postPage');
}, 
{
	name: 'postPageFromSummary',
	data: function() {
		var posts = Posts.findOne(Post_summary.findOne({summaryID: this.params._id}).postID);

		var templateData = {
			postData: posts,
			selectedSummaryID: this.params._id,
			submitSummaryID: posts._id
		};				

		return templateData;
	}
});

Router.route('/submit', {
	name: 'submitPage'
});

Router.route('/dictionary', {
	name: 'dictionaries',
	data: function() {return Dictionaries.find(); }
});

Router.route('/dictionary/:_id', {
	name: 'dictionaryPage',
	data: function() {return Dictionaries.findOne({_id: this.params._id}); }
});

Router.route('/category/:category_name', {
	name: 'categoryPage',
	data: function() {return Categories.findOne({category_name: this.params.category_name}); }
})

Router.route('/term/:_id', {
	name: 'termPage',
	data: function() {
		return Terms.findOne(this.params._id);
	} 
});

Router.route('/newTerm/:name', {
	name: 'newTerm',
	data: function() {return Dictionaries.findOne({name: this.params.name})}
});

Router.route('/newdictionary' , {
	name: 'newDictionary'
});

Router.route('/submitSummary/:submitSummaryID' , {
	name: 'submitSummary',
	data: function() { 
		return Posts.findOne(this.params.submitSummaryID);
	}
});	

Router.route('/summaryList' , {
	name: 'summaryList'
});

Router.route('category/:_id/summaryList', {

	name: 'summaryListByCategory',
	data: function() {
		return Categories.findOne(this.params._id);
	}
});

Router.route('/submitDefinition/:_id', {
	name: 'submitDefinition',
	data: function() {return Terms.findOne(this.params._id)}
});

Router.route('/search/',{
	name: 'searchTemplate',
	waitOn: function() {
		Meteor.subscribe('searchableTerms');
	}
});