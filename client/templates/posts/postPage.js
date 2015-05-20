//PostPage flags for toggeling summaries
var showAllSummaries = new ReactiveVar(false);
var summeriesShown = false;

postData = {};
submitSummaryID = {};

//Run everytime postPage template is rendered. More or less a constructor
Template.postPage.rendered = function() {
    //Reset flags
    summeriesShown = false;
    showAllSummaries.set(false);

    //Resubscribe to the cursor for post_summary incase it has changed
	// NOTE(James): commented out this line because I can't find anywhere that selectedSummaryID is set, and passing null is not useful.
    //Meteor.subscribe('postFromSummaryID', this.data.selectedSummaryID);
}

 
Template.postPage.events({
    //Click event for showing all summaries
	"click .summary-button": function(event, template) {
        
        //Save the button
        var $summaryButton = $('.summary-button');

        //Toggle our flag
        summeriesShown = !summeriesShown;

        //Update the reactive flag
        showAllSummaries.set(summeriesShown);  

        //Toggle class 'show' used to display the correct text
        $summaryButton.toggleClass('show');

        if($summaryButton.hasClass('show')){
            //If summary button has the class show, we're showing all summaires
            // display 'show top summary'
            $summaryButton.text('Show top Summary');
        } else {
            //If summary button has the class show, we're showing the top summary
            // display 'show all summaries'
            $summaryButton.text('Show all Summaries');
        }
	},

    //Click event for the edit post button
    "click .editPostButton": function(event) {
        //Save the edit button
        $editableButton = $('.editPostButton');

        //Toggle the class edit. If the button has class edit, we're in editing mode
        $editableButton.toggleClass('edit');

        if($editableButton.hasClass('edit')){
            //Change the type of every editable input field to text instead of hidden
            $('[name=editableInputField]').attr('type','text');

            //Hide every element with class viewspan. These are the 'uneditable input fields'
            $('.viewSpan').attr('hidden','true');

            //Change the look of the edit button
            $editableButton.removeClass('btn-warning')
            $editableButton.addClass('btn-success');
            $editableButton.html('Save changes <span class="glyphicon glyphicon-pencil"></span>');
            
            //Change the type of the button to 'button' so that the form doesn't auto-submit
            $editableButton.attr('type','button');
            
        } else {
            //Change the type of every editable input field to hidden
            $('[name=editableInputField]').attr('type','hidden');

            //Show every element with the class name containing viewSpan
            $('.viewSpan').removeAttr('hidden');

            //Change the look of the button
            $editableButton.removeClass('btn-success');
            $editableButton.addClass('btn-warning');
            $editableButton.html('Edit Post <span class="glyphicon glyphicon-pencil"></span>');
            
            //Change the type to 'submit' so that the form auto-submits
            $editableButton.attr('type','submit');
        }

    }, 

    //Beforerated event for the rate stars on the post page
    //Used to rebind the 'rated' event before it fires.
    'beforerated .postDataRateItTemplate': function(event,value){

        //Make sure we only change the rated event of the correct item. In this case we want to change summaries
        if(! $('[id=rateitDiv'+this.postData._id+']').hasClass("summaryRating")){

            //Get the old data, and any new data that doesn't require the actual rating from the user
            var postID = this.postData._id;
            
            var foundPost = Posts.findOne(postID);

            var oldProduct = foundPost.quality_rating * foundPost.numRaters;

            var updatedNumRaters = foundPost.numRaters + 1;

            //Bind the rated event and compute the new values with 'value'
            $("#rateitDiv"+this.postData._id).bind('rated', function (event, value) { 

                var newProduct = oldProduct + value;

                var updatedValue = newProduct / updatedNumRaters;

                //Update the rating
                Posts.update({_id: postID}, {$set: {quality_rating: updatedValue, numRaters: updatedNumRaters}});

                //Update the template so that it appears reactive
                $('#uneditableRateItTemplate').rateit('value',updatedValue);
            });
        }
    },

    //Click event for deleting a summary
    'click .deleteSummary': function(e) {
        if(confirm("Are you sure you want to delete this summary?")){
            Summaries.remove(this._id);
        }
    }, 

    //Click event for deleting a comment
    'click .deleteComment': function(e){
        if(confirm("Are you sure you want to delete this comment?")){
            Comments.remove(this._id);
        }
    },

    //Submit form for editing a post
    'submit form': function(e){
        //Prevent the default form actions
        e.preventDefault();

        //Update data. For fields that aren't updated, grab their old value
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

        //Update
        Posts.update(this.postData._id,post);
    }
});

Template.postPage.helpers({

    'findUser': function(_userID) {

        //Find the username that matches the passed in _userID
        return Meteor.users.findOne(_userID).username;
    },

    'findSummaries': function(_postID, _summaryID) {

        //Subscribe to the subset of summaries that belong to this post
        Meteor.subscribe('getSummaries', _postID);

        //showAllSummaries is reactiveBoolean if you want to show all summaries
    	if(showAllSummaries.get()) {

    		return Summaries.find({postID: _postID});
    	}
   		else {

            //if summaryID is undefined, there is no specific summary to load -> find the top-rated summary through the post id
            if(typeof _summaryID === 'undefined'){
                return Summaries.find({postID: _postID}, {sort: {quality_rating: -1}, limit: 1});

            } else {
                return Summaries.find({_id: _summaryID});
            }    		
    	}
    },

    comments: function() {

        //Subscribe to the subset of comments that belong to this post
        Meteor.subscribe('getComments', postData._id);

        return Comments.find();
    },

    //Return all the terms used in this paper
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

    //Return all terms defined in this paper
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