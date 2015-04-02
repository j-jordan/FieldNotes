Template.dictionaries.helpers({
	'dictionaries': function(){
		return Dictionary.find();
	},
	'isAdmin' : function(){
		if(Meteor.user()){
			if(!Roles.userIsInRole(Meteor.user()._id,'admin')){
				return 'hidden';
			}
		} else {
			return 'hidden';
		}
	}
});

Template.newDictionary.events({
	'submit form': function(e){
		e.preventDefault();

		console.log($(e.target).find('[name=title]').val());

		var dictionary = {

			name: $(e.target).find('[name=title]').val()

		};


		dictionary._id = Dictionary.insert(dictionary);
	}
});