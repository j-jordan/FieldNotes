// NOTE(James): Database hooks from the collection-hooks package run AFTER a collection's allow/deny rules.

// Add/update 'createdAt' and 'modifiedAt' whenever a document is added/modified.
function addTimestampHooks(_db) {
    _db.before.insert(function(userId, doc) {
        var now = moment().unix();
        doc.createdAt = now;
        doc.modifiedAt = now;
    });
    _db.before.update(function(userId, doc, fieldNames, modifier, options) {
        modifier.$set = modifier.$set || {};
        modifier.$set.createdAt = undefined;
        modifier.$set.modifiedAt = moment().unix();
    });
}

addTimestampHooks(Posts);