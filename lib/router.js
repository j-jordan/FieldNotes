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
	name: 'dictionaryPage'
});

Router.route('/account', {
	name: 'account'
});

Router.route('/newdictionary' , {
	name: 'newDictionary'
});