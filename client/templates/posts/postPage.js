// var userName = Users.find().fetch()[]['username'];
var showAllSummaries = new ReactiveVar(false);
var summeriesShown = false;

var listOfSummaries = [];


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
            $('[name=editableInputField]').removeAttr('disabled');

            $editableButton.removeClass('btn-warning')
            $editableButton.addClass('btn-success');
            $editableButton.html('Save changes <span class="glyphicon glyphicon-pencil"></span>');
            $editableButton.attr('type','button');
            
        } else {
            $('[name=editableInputField]').attr('disabled','true');
            $editableButton.removeClass('btn-success');
            $editableButton.addClass('btn-warning');
            $editableButton.html('Edit Post <span class="glyphicon glyphicon-pencil"></span>');
            $editableButton.attr('type','submit');
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
            title: this.title,
            pop_rating: this.pop_rating,
            quality_rating: this.quality_rating,
            doi: $(e.target).find('[id=doi]').val(),
            author: $(e.target).find('[id=author]').val(),
            publish_date: $(e.target).find('[id=publish_date]').val(),
            publisher: $(e.target).find('[id=publisher]').val(),
            categoryID: this.categoryID
        };

        Posts.update(this._id,post);
    },

    'rated': function(event,value){

            if(! $('[id=rateitDiv'+this._id+']').hasClass("summaryRating")){

                var postID = this._id;

                var foundPost = Posts.findOne(postID);

                var oldProduct = foundPost.quality_rating * foundPost.numRaters;

                var updatedNumRaters = foundPost.numRaters + 1;

                $("#rateitDiv"+postID).bind('rated', function (event, value) { 
                    
                    var newProduct = oldProduct + value;

                    var updatedValue = newProduct / updatedNumRaters;

                    console.log(updatedValue, updatedNumRaters);

                    Posts.update({_id: postID}, {$set: {quality_rating: updatedValue, numRaters: updatedNumRaters}});
                });     
            } 
    }
});

Template.postPage.helpers({
    'loggedIn': function(){
        if(Meteor.user())
            return true;
        else 
            return false;
    },

    'findUser': function(userID) {
        return Meteor.users.findOne(userID).username;
    },

    'findSummaries': function(pageID) {
    	var summaries=[];
    	if(showAllSummaries.get()) {
    		var summaryID = Post_summary.find({postID: pageID}).fetch();

    		for (var i = summaryID.length - 1; i >= 0; i--) {		
    		   	summaries.push(Summaries.findOne(summaryID[i].summaryID));
    		}  		
    		return summaries;
    	}
   		else {
    		var summaryID = Post_summary.findOne({postID: pageID}).summaryID;
			return Summaries.find({_id: summaryID});
    	}
    },

    comments: function() {
        return Comments.find({postID: this._id});
    }, 

    'isAdmin' : function(){
        if(Meteor.user()){
            if(!Roles.userIsInRole(Meteor.user()._id,'admin')){
                return 'hidden';
            }
        } else {
            return 'hidden';
        }
    },

    'terms_used': function(postId){

        var termArray = [];     

        //Find all term ids for the passed in postId
        var termIdArray = Post_terms_used.find({postID: postId}, {fields: {_id: 0,postID: 0}, reactive: 0}).fetch();
        
        //Strip the __proto__ object
        for (var i = termIdArray.length - 1; i >= 0; i--) {
            termArray.push(termIdArray[i].termID);
        };

        return Terms.find({_id: {$in: termArray}});
    },

    'terms_defined': function(postId){
        var termArray = [];     

        //Find all term ids for the passed in postId
        var termIdArray = Post_terms_defined.find({postID: postId}, {fields: {_id: 0,postID: 0}, reactive: 0}).fetch();
        
        //Strip the __proto__ object
        for (var i = termIdArray.length - 1; i >= 0; i--) {
            termArray.push(termIdArray[i].termID);
        };

        return Terms.find({_id: {$in: termArray}});
    }
});