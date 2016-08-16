import {Meteor} from 'meteor/meteor';

Meteor.methods({

    deleteFiles: function (filter) {
        return Files.remove(filter);
    }

});
