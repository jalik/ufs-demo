import {Meteor} from 'meteor/meteor';


// Load collections
import './collections/files';
import './collections/thumbnails';

// Load lib
import './lib';

if (Meteor.isServer) {
    // Load methods and publications
    require('./server/methods');
    require('./server/publications');

    // Load stores
    require('./stores/thumbnails');
    require('./stores/files');
}
