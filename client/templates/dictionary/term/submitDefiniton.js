Template.submitDefinition.onCreated(function() {
    this.previewData = new ReactiveVar("");
});

Template.submitDefinition.events({
    'click button[name=submitButton]': function(e) {
        //Insert the new definition
        Definitions.insert({
            termID: this._id,
            userID: Meteor.user()._id,
            text: Template.instance().$('[name=definition]').val(),
            quality_rating: 0,
            numRaters: 0
        });

        // Redirect to the term page
        Router.go('termPage', this);
    },

    'input [name=definition], change [name=definition], paste [name=definition], keyup [name=definition], mouseup [name=definition]': function(e) {
        var converter = new Showdown.converter();
        var text = Template.instance().find("textarea[name=definition]").value;
        Template.instance().previewData.set(converter.makeHtml(text));
    },
});

Template.submitDefinition.helpers({
    'preview_data': function() {
        return Template.instance().previewData.get();
    }
});
