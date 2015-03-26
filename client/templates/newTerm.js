var dynamicFields = [];
Template.newTerm.helpers({
	'getDynamicFields': function(dictId){
		var adminLabelIDs = Admin_term_fields.find({dictionaryID: dictId}, {fields: {'AdminlabelsID': 1}}).fetch();
		dynamicFields = [];
		for (var i = adminLabelIDs.length - 1; i >= 0; i--) {
			dynamicFields.push(Adminlabels.findOne({_id: adminLabelIDs[i]['AdminlabelsID']}));
		}
	},
	'dynamFields': function() {
		return dynamicFields;
	}
});