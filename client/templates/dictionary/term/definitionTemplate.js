Template.definitionTemplate.events({
	'beforerated': function(e){

		var definitionID = this._id;

		$("#rateitDiv"+definitionID).bind('rated', function (event, value) { 

			var foundDefinition = Definitions.findOne(definitionID);

			var oldProduct = foundDefinition.quality_rating * foundDefinition.numRaters;

			var updatedNumRaters = foundDefinition.numRaters + 1;

			var newProduct = oldProduct + value;

			var updatedValue = newProduct / updatedNumRaters;

			console.log(updatedValue, newProduct);

			Definitions.update({_id: definitionID}, {$set: {quality_rating: updatedValue, numRaters: updatedNumRaters}});

			$('#uneditableRateItTemplate'+definitionID).rateit('value',updatedValue);
		});

		$(e.target).bind('beforerated',function(e){	e.preventDefault();});
	}
});