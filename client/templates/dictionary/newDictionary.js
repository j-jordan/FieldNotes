//Session variables used to keep track of rows. The value is arbitrary, i.e it has no significance
Session.set("labelRows", [0]);

Template.newDictionary.helpers({
	//Is this the last row of labels. Returns true or false
	'isLastRow': function(index) {
		var labelRow = Session.get("labelRows");

		var count = labelRow.length;

		if(index == count-1)
		{
			return true;
		} else
			return false;
	},

	//Return session variable labelRows
	'getLabelRows': function(e) {
		return Session.get("labelRows");
	},

	//getArray is used to create the correct number of rows in the new dictionary page
	//the returned object of value and index are used to differentiate each HTML element
	'getArray': function() {
		var self = this;

		//Get labelRows from the session. If it's empty instantiate to empty array
		self.myArray = Session.get('labelRows') || [];

		//Map each element of the array to the function
		return _.map(self.myArray, function(value,index){

			//Return the objects value and index in an object
			return {value: value, index: index};
		});
	}
});

Template.newDictionary.events({

	//Click event to add a row
	'click #increaseRow ': function(event) {
		//Get the labelRows session variable and add a new element to it. Doesn't matter what
		var row = Session.get('labelRows');
		row.push(0);

		//Update the variable
		Session.set('labelRows', row);
	},

	//Click event to delete a row
	'click #deleteRow': function(event) {
		//Get the index of the clicked row
		var index = this.index;
		
		//Remove the approriate row
		$('#row'+index).remove()
	},

	//Submit form for new dictionary
	'submit form': function(e) {
		//Prevent the forms default action
		e.preventDefault();

		//Validation flag
		var validated = true;

		//Map function for each element that is required.
		$(e.target).find('.required').map(function(index, object){			
			//If any element doesn't have a value, we should fail validation
			if(this.value === '')
				validated = false;
		})

		//If everything passed validation
		if(validated){

			//update data
			var dictionary = {
				name: $(e.target).find('[name=title]').val()
			};

			//update
			dictionary._id = Dictionaries.insert(dictionary);

			//Update data for label names
			var labelNames = [];
			//Update data for label descriptions
			var labelDescription = [];

			//Function for each element that has name dynamicVarName
			$(e.target).find('[name="dynamicVarName[]"]').each(function() {
				//use this.val() to get the values of each
				labelNames.push($(this).val());
			});

			//Function for each element that has name variableType
			$(e.target).find('[name="variableType[]"]').each(function() {
				//use this.val() to get the values of each name
				labelDescription.push($(this).val());
			});

			//Update
			for(var i = 0; i < labelNames.length; i++)
			{
				//Update data. Grab the positions out of label names/description
				var adminLabel = {
					dictionaryID: dictionary._id,
					label : labelNames[i],
					description : labelDescription[i]
				};

				//Update
				Adminlabels.insert(adminLabel);
			}

			//Route back to the list of dictionaries to see you newly created dictionary
			Router.go('dictionaries');
		}
		//Validation failed
		else{
			alert("Please fill out all required fields");
		}
	}
});