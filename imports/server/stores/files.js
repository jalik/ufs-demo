import '/imports/collections/files';
import {UploadFS} from 'meteor/jalik:ufs';

/**
 * Store permissions
 * @type {UploadFS.StorePermissions}
 */
// const defaultPermissions = new UploadFS.StorePermissions({
//     insert: function (userId, file) {
//     },
//     remove: function (userId, file) {
//         if (userId !== file.userId && file.userId) {
//             throw new Meteor.Error('forbidden', "You must be logged in to delete a file");
//         }
//     },
//     update: function (userId, file) {
//     },
// });

/**
 * File filter
 * @type {UploadFS.Filter}
 */
FileFilter = new UploadFS.Filter({
    minSize: 1,
    // maxSize: 1024 * 1000 * 10, // 10MB,
    contentTypes: ['image/*', 'audio/*', 'video/*', 'application/*']
});

/**
 * File store using local file system
 * @type {UploadFS.store.Local}
 */
FileStore = new UploadFS.store.Local({
    collection: Files,
    name: 'files',
    path: '/uploads/files',
    filter: FileFilter,
    // permissions: defaultPermissions,
    onRead: FileReadHandler,
    copyTo: [
        ThumbnailStore
    ]
});

/**
 * File store using Mongo GridFS
 * @type {UploadFS.store.GridFS}
 */
// FileStore = new UploadFS.store.GridFS({
//     collection: Files,
//     name: 'files',
//     chunkSize: 1024 * 255,
//     filter: FileFilter,
//     // permissions: defaultPermissions,
//     onRead: FileReadHandler,
//     copyTo: [
//         ThumbnailStore
//     ]
// });
