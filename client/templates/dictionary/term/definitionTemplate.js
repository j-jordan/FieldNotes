Template.definitionTemplate.helpers({
	'getDefinition' : function(definitionID){
	}
});

Template.definitionTemplate.events({
	'rated': function(event,value){
		console.log(this);
		var definitionID = this._id;

		var foundDefinition = Definitions.findOne(definitionID);

		var oldProduct = foundDefinition.quality_rating * foundDefinition.numRaters;

		var updatedNumRaters = foundDefinition.numRaters + 1;

		$("#rateitDiv"+definitionID).bind('rated', function (event, value) { 
			
			var newProduct = oldProduct + value;

			var updatedValue = newProduct / updatedNumRaters;

			console.log(updatedValue, newProduct);

			Definitions.update({_id: definitionID}, {$set: {quality_rating: updatedValue, numRaters: updatedNumRaters}});
		});		
	}
});