import '/imports/collections/files';
import {UploadFS} from 'meteor/jalik:ufs';

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
    // Overwrite default permissions
    // permissions: new UploadFS.StorePermissions({
    //     insert: function (userId, file) {
    //         return false;
    //     },
    //     remove: function (userId, file) {
    //         return !file.userId || userId === file.userId;
    //     },
    //     update: function (userId, file) {
    //         return !file.userId || userId === file.userId;
    //     },
    // }),
    onRead: FileReadHandler,
    copyTo: [
        ThumbnailStore
    ],
    transformWrite: function (from, to, fileId, file) {
        if (file.type && file.type.startsWith('image/')) {
            const gm = Npm.require('gm');

            if (gm) {
                gm(from)
                    .quality(90)
                    .autoOrient()
                    .stream().pipe(to);
            } else {
                console.error("gm is not installed");
            }
        } else {
            from.pipe(to);
        }
    }
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
