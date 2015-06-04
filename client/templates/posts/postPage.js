Template.postPage.onCreated(function() {
    //PostPage flag for toggeling summaries
    this.showAllSummaries = new ReactiveVar(false);
});

Template.postPage.events({
    //Click event for showing all summaries
    "click .summary-button": function(event, template) {

        //Save the button
        var $summaryButton = $('.summary-button');

        //Update the reactive flag
        var sas = Template.instance().showAllSummaries;
        sas.set(!sas.get());

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
        if(! $('[id=rateitDiv'+this.data._id+']').hasClass("summaryRating")){

            //Get the old data, and any new data that doesn't require the actual rating from the user
            var postID = this.data._id;

            var foundPost = Posts.findOne(postID);

            var oldProduct = foundPost.quality_rating * foundPost.numRaters;

            var updatedNumRaters = foundPost.numRaters + 1;

            //Bind the rated event and compute the new values with 'value'
            $("#rateitDiv"+this.data._id).bind('rated', function (event, value) {

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
        var updatedPost = {
            $set : {
                //userID: Meteor.user()._id,
                //title: this.postData.title,
                //pop_rating: this.postData.pop_rating,
                //quality_rating: this.postData.quality_rating,
                doi: $(e.target).find('[id=doi]').val(),
                author: $(e.target).find('[id=author]').val(),
                publisher : $(e.target).find('[id=publisher]').val(),
                publish_date: $(e.target).find('[id=publish_date]').val(),
                //categoryID: this.postData.categoryID
            }
        };

        //Update
        Posts.update(this._id, updatedPost);
    }
});

Template.postPage.helpers({

    'findUser': function(_userID) {
        return Meteor.users.findOne(_userID).username;
    },

    'findSummaries': function() {
        //showAllSummaries is reactiveBoolean if you want to show all summaries
        if(Template.instance().showAllSummaries.get()) {
            return Summaries.find({postID: this._id});
        }
        else {
            return Summaries.find({postID: this._id}, {sort: {quality_rating: -1}, limit: 1});
        }
    },

    'comments': function() {
        return Comments.find({postID: this._id});
    },

    //Return all the terms used in this paper
    'terms_used': function() {
        return Terms.find({_id: {$in: this.usedTermIDArray}});
    },

    //Return all terms defined in this paper
    'terms_defined': function() {
        return Terms.find({_id: {$in: this.definedTermIDArray}});
    },

    'submitSummaryData': function() {
        return { submitSummaryID: this._id };
    }
});
