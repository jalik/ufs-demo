import {Mongo} from 'meteor/mongo';

/**
 * The file collection
 * @type {Mongo.Collection}
 */
Files = new Mongo.Collection('files');

// Allow only files to be deleted from the client
Files.allow({
    insert: function (userId, file) {
        return false;
    },
    remove: function (userId, file) {
        return true;
    },
    update: function (userId, file, fields, mod) {
        return false;
    }
});
