// ACL function factory
// Returned functions return true IFF all specified functions return true.
function aclALL(_funcArray) {
	return function(_userid, _doc, _fields, _modifier) {
		var result = true;

		for (var i = 0; i < _funcArray.length; i++) {
			result = result && _funcArray[i](_userid, _doc, _fields, _modifier);
		}

		return result;
	}
}

// ACL function factory
// Returned functions return true IFF each of the entries in the _fields Array are contained within _allowedFieldsArray
function aclOnlyWhitelistedFieldsModified(_allowedFieldsArray) {
	return function(_userid, _doc, _fields, _modifier) {
		for (var x = 0; x < _fields.length; x++) {
			var allowed = false;

			for (var y = 0; y < _allowedFieldsArray.length; y++) {
				if (_fields[x] === _allowedFieldsArray[y]) {
					allowed = true;
				}
			}

			if (!allowed) {
				return false;
			}
		}

		return true;
	}
}

// ACL function
// Returns true IFF the provided _userid has the 'admin' role.
function aclUserIsAdmin(_userid) {
	return Roles.userIsInRole(_userid, 'admin');
}

// ACL function
// Returns true IFF the provided _userid is not null.
function aclUserIsAuthed(_userid) {
	return (typeof _userid !== null);
}

// Database name -> request type -> boolean value or function returning boolean
// NOTE(James): When adding a new Database name entry, be sure that a thunk for it exists at the bottom of this file.
// TODO(James): Add more rigorous validation and move it out of the ACL.
var accessControlList = {
	'Posts' : {
		'insert' : aclUserIsAuthed,
		'update' : aclALL([	aclUserIsAdmin,
							aclOnlyWhitelistedFieldsModified([ 'doi', 'author', 'publisher', 'publish_date'])
							]),
	},
	'Comments' : {
		'insert' : aclUserIsAuthed,
		'update' : aclOnlyWhitelistedFieldsModified([ 'pop_rating' ]),
		'remove' : aclUserIsAdmin
	},
	'Dictionaries' : {
		'insert' : aclUserIsAuthed,
		'update' : aclALL([	aclUserIsAdmin,
							aclOnlyWhitelistedFieldsModified([ 'name' ])
							]),
		'remove' : aclUserIsAdmin
	},
	'Adminlabels' : {
		'insert' : aclUserIsAuthed,
	},
	'Summaries' : {
		'insert' : aclUserIsAuthed,
		'remove' : aclUserIsAdmin
	},
	'Terms' : {
		'insert' : aclUserIsAuthed,
		'update' : aclALL([	aclUserIsAdmin,
							aclOnlyWhitelistedFieldsModified([ 'term_name' ])
							]),
		'remove' : aclUserIsAdmin
	},
	'Definitions' : {
		'insert' : aclUserIsAuthed,
		'remove' : aclUserIsAdmin
	},
	'Term_label_values' : {
		'insert' : aclUserIsAuthed,
		'update' : aclALL([	aclUserIsAdmin,
							aclOnlyWhitelistedFieldsModified([ 'termID', 'adminlabelsID', 'value' ])
							]),
	}
};

// Checks the ACL for an entry matching the requested change.
function checkAccess(_dbname, _type, _userid, _doc, _fields, _modifier) {
	if (accessControlList[_dbname]) {
		if (accessControlList[_dbname][_type]) {
			if (typeof accessControlList[_dbname][_type] === "boolean") {
				var allow = accessControlList[_dbname][_type];
				if (!allow) {
					console.log("WARN: databaseAccessRules.js: " + _dbname + " " + _type + " denied - ACL boolean false. (userid: " + _userid + ", doc: " + JSON.stringify(_doc) + ")");
				}
				return allow;
			} else if (typeof accessControlList[_dbname][_type] === "function") {
				var allow = accessControlList[_dbname][_type](_userid, _doc, _fields, _modifier);
				if (!allow) {
					console.log("WARN: databaseAccessRules.js: " + _dbname + " " + _type + " denied - ACL function returned false. (userid: " + _userid + ", doc: " + JSON.stringify(_doc) + ")");
				}
				return allow;
			}
		}
	}
	console.log("WARN: databaseAccessRules.js: " + _dbname + " " + _type + " denied - No rule defined. (userid: " + _userid + ", doc: " + JSON.stringify(_doc) + ")");
	return false;
}

function thunkFactory(name) {
	return {
		insert : function(userId, doc) {
			return checkAccess(name, 'insert', userId, doc);
		},
		update : function(userId, doc, fieldNames, modifier) {
			return checkAccess(name, 'update', userId, doc, fieldNames, modifier);
		},
		remove : function(userId, doc) {
			return checkAccess(name, 'remove', userId, doc);
		}
	};
}

Posts.allow(thunkFactory('Posts'));
Comments.allow(thunkFactory('Comments'));
Dictionaries.allow(thunkFactory('Dictionaries'));
Adminlabels.allow(thunkFactory('Adminlabels'));
Summaries.allow(thunkFactory('Summaries'));
Terms.allow(thunkFactory('Terms'));
Categories.allow(thunkFactory('Categories'));
Definitions.allow(thunkFactory('Definitions'));

Term_label_values.allow(thunkFactory('Term_label_values'));