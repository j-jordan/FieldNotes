Standardsearchs = new Mongo.Collection(null);
//Array of indexes to search. Indexes defined in collections.js
Template.searchTemplate.helpers({
    indexes: function() {
        return ['posts', 'dictionary', 'terms'];
    }
});
