Posts = new Mongo.Collection('posts');
Comments = new Mongo.Collection('comments');
Dictionaries = new Mongo.Collection('dictionary');
Admin_term_fields = new Mongo.Collection('admin_term_fields');
Adminlabels = new Mongo.Collection('adminlabels');
Post_terms_defined = new Mongo.Collection('post_terms_defined');
Post_terms_used = new Mongo.Collection('post_terms_used');
Post_summary = new Mongo.Collection('post_summary');
Summaries = new Mongo.Collection('summaries');
Terms = new Mongo.Collection('terms');
Categories = new Mongo.Collection('categories');
Term_label_values = new Mongo.Collection('term_label_values');
Definitions = new Mongo.Collection('definitions');
Term_definition = new Mongo.Collection('term_definition');

Posts.initEasySearch(['title', 'doi', 'author', 'publisher'], {
    'limit' : 20
});

Dictionaries.initEasySearch(['name'],{

});

Terms.initEasySearch(['term_name'],{

});