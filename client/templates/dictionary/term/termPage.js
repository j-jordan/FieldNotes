var label = [];

Template.termPage.helpers({
	'getDynamicFields': function(dictId) {
		var adminLabelIDs = Admin_term_fields.find({dictionaryID: dictId}, {fields: {'AdminlabelsID': 1}}).fetch();
		label = [];
		for (var i = adminLabelIDs.length - 1; i >= 0; i--) {
			label.push(Adminlabels.findOne({_id: adminLabelIDs[i]['AdminlabelsID']}));
		}
	},
	'labels': function(){
		return label;
	}
});