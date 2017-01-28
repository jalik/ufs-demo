import {Mongo} from 'meteor/mongo';

/**
 * The file collection
 * @type {Mongo.Collection}
 */
export const Files = new Mongo.Collection('files');

// Allow only files to be deleted from the client
Files.allow({
    insert(userId, file) {
        return false;
    },
    remove(userId, file) {
        return true;
    },
    update(userId, file, fields, mod) {
        return false;
    }
});
