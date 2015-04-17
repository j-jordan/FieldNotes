Session.set("labelRows", [0]);

Template.newDictionary.helpers({
	'isLastRow': function(index) {
		var labelRow = Session.get("labelRows");

		var count = labelRow.length;

		if(index == count-1)
		{
			return true;
		} else
			return false;
	},

	'getLabelRows': function(e) {
		return Session.get("labelRows");
	},

	'getArray': function() {
		var self = this;
		self.myArray = Session.get('labelRows') || [];
		return _.map(self.myArray, function(value,index){
			return {value: value, index: index};
		});
	}
});

Template.newDictionary.events({

	'click #increaseRow ': function(event) {
		var row = Session.get('labelRows');
		row.push(0);

		Session.set('labelRows', row);
	},

	'click #deleteRow': function(event) {
		var index = this.index;
		var findArg = "[id=row" + index + "]";
/*		var temp = Session.get('labelRows');
		var findArg = "[id=row" + index + "]";
		temp.splice(0,1);
		Session.set('labelRows', temp);
*/		console.log($('#row'+index).remove())
	},

	'submit form': function(e) {
		e.preventDefault();

		var dictionary = {
			name: $(e.target).find('[name=title]').val()
		};

		dictionary._id = Dictionary.insert(dictionary);

		var labelNames = [];
		var labelDescription = [];

		$(e.target).find('[name="dynamicVarName[]"]').each(function() {
			//use this.val() to get the values of each
			labelNames.push($(this).val());
		});

		$(e.target).find('[name="variableType[]"]').each(function() {
			//use this.val() to get the values of each name
			labelDescription.push($(this).val());
		});

		for(var i = 0; i < labelNames.length; i++)
		{
			var adminLabel = {
				label : labelNames[i],
				description : labelDescription[i]
			}

			adminLabel._id = Adminlabels.insert(adminLabel);

			admin_term_field = {
				dictionaryID: dictionary._id,
				AdminlabelsID: adminLabel._id
			}

			Admin_term_fields.insert(admin_term_field);
		}

		Router.go("/dictionary");
	}
})


Handlebars.registerHelper('each_with_index', function(cursor, options){
	var fn = options.fn, inverse = options.inverse;
	var ret = "";
	var idx = 0;

	cursor.forEach(function(item){
		idx++;
		item.index = idx;
		ret+=fn(item);
	});
	return ret;
})

