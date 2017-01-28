import {Meteor} from 'meteor/meteor';
import {Files} from '../collections/files';


Meteor.methods({
    deleteFiles(filter) {
        return Files.remove(filter);
    }
});
