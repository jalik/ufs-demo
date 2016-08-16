import '../collections/thumbnails';
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
 * Thumbnail filter
 * @type {UploadFS.Filter}
 */
ThumbnailFilter = new UploadFS.Filter({
    contentTypes: ['image/*']
});

/**
 * The thumbnails store
 * @type {UploadFS.store.Local}
 */
ThumbnailStore = new UploadFS.store.Local({
    collection: Thumbnails,
    name: 'thumbnails',
    path: '/uploads/thumbnails',
    filter: ThumbnailFilter,
    // permissions: defaultPermissions,
    onRead: FileReadHandler,
    transformWrite: function (from, to, fileId, file) {
        const gm = Npm.require('gm');

        if (gm) {
            // Resize image
            gm(from)
                .resize(64, 64)
                .gravity('Center')
                .extent(64, 64)
                .quality(75)
                .stream().pipe(to);
        } else {
            console.error("gm is not installed");
        }
    }
});
