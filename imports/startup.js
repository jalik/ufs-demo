import './common';

// Load collections
import './collections/files';
import './collections/thumbnails';

// Load client logic
if (Meteor.isClient) {
    require('./client/index');
}
// Load server logic
else if (Meteor.isServer) {
    require('./server/index');
}
