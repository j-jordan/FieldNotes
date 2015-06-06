Template.submitPage.onCreated(function() {
    this.previewData = new ReactiveVar;
});

/**
 * Handles the submit form action for submitPage.html
 *
 * Save the summary
 * Save the post
 * Insert the _id's into post_summary
 * Check terms collection for any terms in terms_used or terms_defined and get _id's
 * Link the _id's with the post._id in appropriate pivot tables
 * Any terms from terms_defined that weren't found are new terms -> Add them to terms and get back _id's
 * Save the new term _id's into pivot table
 *
 * @param {e} form submit event.
 */
Template.submitPage.events({
    'submit form': function(e) {
        //Stop the browser from submitting the form.
        e.preventDefault();

        var validated = true;

        $(e.target).find('.required').map(function(index, object) {
            if (this.value === '') {
                validated = false;
            }
        })

        if (!validated) {
            alert("Please fill in all required fields.");
            return;
        }

        //Insert the new post
        var post = {
            userID: Meteor.user()._id,
            title: $(e.target).find('[name=title]').val(),
            pop_rating: 0,
            quality_rating: 0,
            numRaters : 0,
            doi: $(e.target).find('[name=doi]').val(),
            author: $(e.target).find('[name=author]').val(),
            publish_date: $(e.target).find('[name=publish_date]').val(),
            publisher: $(e.target).find('[name=publisher]').val(),
            categoryID: $(e.target).find('#dropdownMenuButton').prop("value"),
            definedTermIDArray : [], //TODO(James): actually fill this array
            usedTermIDArray : [] //TODO(James): actually fill this array
        };

        post._id = Posts.insert(post);

        //Insert the new summary
        var summary = {
            userID: Meteor.user()._id,
            postID: post._id,
            text: $(e.target).find('[name=summary]').val(),
            quality_rating : 0,
            numRaters : 0
        };

        Summaries.insert(summary);

        //Find any terms that already exist
        var terms_defined = $(e.target).find('[name=terms_used]');
        var terms_used = $(e.target).find('[name=terms_defined]');

        //Redirect to the postpage
        Router.go('postPage',post);
    },

    'click .dropdown-menu li a': function(e) {
        $('#dropdownMenuButton').html(this.category_name +'<span class="caret"></span>').prop("value", this._id);
    },

    'input [name=summary], change [name=summary], paste [name=summary], keyup [name=summary], mouseup [name=summary]': function(e) {
        var converter = new Showdown.converter();
        var text = Template.instance().find("textarea[name=summary]").value;
        Template.instance().previewData.set(converter.makeHtml(text));
    },

});

Template.submitPage.helpers({
    'submitPageCategoryOptions': function() {
        return Categories.find({parentID: 0});
    },

    'categories': function() {
        return Categories.find();
    },
    'loggedIn': function(){
        if(Meteor.user())
            return true;
        else
            return false;
    },
    'preview_data': function() {
        return Template.instance().previewData.get();
    }
});

//Returns the data for the autocomplete search function
Template.search.helpers({
    'terms': function(){
        return Terms.find().fetch().map(function(it){ return it.term_name; });
    }
});

//Tell iron:router to wait until the template is rendered to inject data
//otherwise the autocomplete typeahead won't work
Template.search.rendered = function() {
  Meteor.typeahead.inject();
};
