Template.dictionaryPage.helpers({
	'terms': function(dictID) {
		return Terms.find({dictionaryID: dictID});
	}
});