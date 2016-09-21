import {UploadFS} from 'meteor/jalik:ufs';


import './methods';
import './publications';

// Load stores
import './stores/thumbnails';
import './stores/files';

// Configure UploadFS
UploadFS.addMimeType('kml', 'application/vnd.google-earth.kml+xml');
UploadFS.addMimeType('kmz', 'application/vnd.google-earth.kmz');
