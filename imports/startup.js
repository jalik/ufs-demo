import {Meteor} from 'meteor/meteor';

// Load files API
import '/imports/api/files/index';

// Load client logic
if (Meteor.isClient) {
    require('./client/index');
}
// Load server logic
else if (Meteor.isServer) {
    require('./server/index');
}
