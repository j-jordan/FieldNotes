Router.configure({
	layoutTemplate: 'layout'
});

Router.route('/', {
	name: 'postsList'
});

Router.route('/posts/:_id', {
	name: 'postPage',
	data: function() {return Posts.findOne(this.params._id); }
});

Router.route('/submit', {
	name: 'submitPage'
});

Router.route('/dictionary', {
	name: 'dictionaries'
});

Router.route('/dictionary/:name', {
	name: 'dictionaryPage',
	data: function() {return Dictionary.findOne({name: this.params.name}); }
});

Router.route('/category/:category_name', {
	name: 'categoryPage',
	data: function() {return Categories.findOne({category_name: this.params.category_name}); }
})

Router.route('/term/:term_name', {
	name: 'termPage',
	data: function() {return Terms.findOne({term_name: this.params.term_name}); } //return Terms.findOne({_id: this.params.termId}); }
});

Router.route('/newTerm/:name', {
	name: 'newTerm',
	data: function() {return Dictionary.findOne({name: this.params.name})}
});

Router.route('/account', {
	name: 'account'
});

Router.route('/newdictionary' , {
	name: 'newDictionary'
});

Router.route('/submitSummary/:_id' , {
	name: 'submitSummary',
	data: function() {return Posts.findOne(this.params._id)}
});	

Router.route('/summaryList') , {
	name: 'summaryList'
}