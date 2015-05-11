//PostPage flags for toggeling summaries
var showAllSummaries = new ReactiveVar(false);
var summeriesShown = false;


Template.postPage.rendered = function() {
    summeriesShown = false;
    showAllSummaries.set(false);

    Meteor.subscribe('postIDfromSummaryID', this.data.selectedSummaryID);
}

 
Template.postPage.events({
	"click .summary-button": function(event, template) {
        
        var $summaryButton = $('.summary-button');

        summeriesShown = !summeriesShown;

        showAllSummaries.set(summeriesShown);  

        $summaryButton.toggleClass('show');


        if($summaryButton.hasClass('show')){
            $summaryButton.text('Show top Summary');
        } else {
            $summaryButton.text('Show all Summaries');
        }
	},
    "click .editPostButton": function(event) {

        $editableButton = $('.editPostButton');

        $editableButton.toggleClass('edit');

        if($editableButton.hasClass('edit')){
            $('[name=editableInputField]').attr('type','text');
            $('.viewSpan').attr('hidden','true');

            $editableButton.removeClass('btn-warning')
            $editableButton.addClass('btn-success');
            $editableButton.html('Save changes <span class="glyphicon glyphicon-pencil"></span>');
            $editableButton.attr('type','button');
            
        } else {
            $('[name=editableInputField]').attr('type','hidden');
            $('.viewSpan').removeAttr('hidden');

            $editableButton.removeClass('btn-success');
            $editableButton.addClass('btn-warning');
            $editableButton.html('Edit Post <span class="glyphicon glyphicon-pencil"></span>');
            $editableButton.attr('type','submit');
        }

    }, 

    'beforerated .postDataRateItTemplate': function(event,value){

        if(! $('[id=rateitDiv'+this.postData._id+']').hasClass("summaryRating")){

            var postID = this.postData._id;
            
            var foundPost = Posts.findOne(postID);

            var oldProduct = foundPost.quality_rating * foundPost.numRaters;

            var updatedNumRaters = foundPost.numRaters + 1;

            $("#rateitDiv"+this.postData._id).bind('rated', function (event, value) { 

                var newProduct = oldProduct + value;

                var updatedValue = newProduct / updatedNumRaters;

                Posts.update({_id: postID}, {$set: {quality_rating: updatedValue, numRaters: updatedNumRaters}});

                $('#uneditableRateItTemplate').rateit('value',updatedValue);
            });
        }
    },

    'click .deleteSummary': function(e) {
        if(confirm("Are you sure you want to delete this summary?")){
            Summaries.remove(this._id);
        }
    }, 

    'click .deleteComment': function(e){
        if(confirm("Are you sure you want to delete this comment?")){
            Comments.remove(this._id);
        }
    },
    'submit form': function(e){
        e.preventDefault();

        var post = {
            userID: Meteor.user()._id,
            title: this.postData.title,
            pop_rating: this.postData.pop_rating,
            quality_rating: this.postData.quality_rating,
            doi: $(e.target).find('[id=doi]').val(),
            author: $(e.target).find('[id=author]').val(),
            publisher : $(e.target).find('[id=publisher]').val(),
            publish_date: $(e.target).find('[id=publish_date]').val(),
            publisher: $(e.target).find('[id=publisher]').val(),
            categoryID: this.postData.categoryID
        };

        Posts.update(this.postData._id,post);
    }
});

Template.postPage.helpers({

    'findUser': function(_userID) {

        //Find the username that matches the passed in _userID
        return Meteor.users.findOne(_userID).username;
    },

    'findSummaries': function(postID, summaryID) {

        //Subscribe to the subset of summaries that belong to this post
        Meteor.subscribe('getSummaries', postID);

        //showAllSummaries is reactiveBoolean if you want to show all summaries
    	if(showAllSummaries.get()) {

    		return Summaries.find();
    	}
   		else {

            //if summaryID is undefined, there is no specific summary to load -> find the top-rated summary through the post id
            if(typeof summaryID === 'undefined'){
                return Summaries.find({}, {sort: {quality_rating: -1}, limit: 1});

            } else {
                return Summaries.find({_id: summaryID});
            }    		
    	}
    },

    comments: function() {

        //Subscribe to the subset of comments that belong to this post
        Meteor.subscribe('getComments', this.postData._id);

        return Comments.find();
    }, 

    'isAdmin' : function(){

        if(Meteor.user()){
            //if your user is an admin
            if(!Roles.userIsInRole(Meteor.user()._id,'admin')){
                return 'hidden';
            }
        } else {
            return 'hidden';
        }
    },

    'terms_used': function(_postID){

        //Subscribe to the subset of terms used in this paper
        Meteor.subscribe('terms', _postID);
        Meteor.subscribe('terms_used', _postID);

        var term_used_IDs = Post_terms_used.find().fetch();

        var termsUsed = [];

        for (var i = term_used_IDs.length - 1; i >= 0; i--) {
            termsUsed.push(Terms.findOne(term_used_IDs[i].termID));
        };

        return termsUsed;
    },

    'terms_defined': function(_postID){
        
        //Subscribe to the subset of terms defined in this paper
        Meteor.subscribe('terms_defined', _postID);

        var term_defined_IDs = Post_terms_defined.find().fetch();

        var termsDefined = [];

        for (var i = term_defined_IDs.length - 1; i >= 0; i--) {
            termsDefined.push(Terms.findOne(term_defined_IDs[i].termID));
        };
        
        return termsDefined;
    }
});