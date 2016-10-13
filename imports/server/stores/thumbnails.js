import '/imports/collections/thumbnails';
import {UploadFS} from 'meteor/jalik:ufs';

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
        if (file.type && file.type.startsWith('image/')) {
            const gm = Npm.require('gm');

            if (gm) {
                // Resize image
                gm(from)
                    .resize(64, 64)
                    .gravity('Center')
                    .extent(64, 64)
                    .quality(75)
                    .autoOrient()
                    .stream().pipe(to);
            } else {
                console.error("gm is not installed");
            }
        } else {
            // do nothing
        }
    }
});
