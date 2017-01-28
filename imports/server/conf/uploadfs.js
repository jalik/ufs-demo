import {UploadFS} from 'meteor/jalik:ufs';


// Add custom MIME types
UploadFS.addMimeType('kml', 'application/vnd.google-earth.kml+xml');
UploadFS.addMimeType('kmz', 'application/vnd.google-earth.kmz');


// Set default store permissions
UploadFS.config.defaultStorePermissions = new UploadFS.StorePermissions({
    insert(userId, file) {
        // allow anyone (connected and anonymous users) to upload a file
        return true;
    },
    remove(userId, file) {
        // allow anyone to remove public files, but only owners to remove their files
        return !file.userId || userId === file.userId;
    },
    update(userId, file) {
        // allow anyone to update public files, but only owners to update their files
        return !file.userId || userId === file.userId;
    },
});
