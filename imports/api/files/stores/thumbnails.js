import gm from 'gm';
import {UploadFS} from 'meteor/jalik:ufs';
import {FileReadHandler} from '../lib';
import {Thumbnails} from '../collections/thumbnails';


/**
 * Thumbnail filter
 * @type {UploadFS.Filter}
 */
export const ThumbnailFilter = new UploadFS.Filter({
    contentTypes: ['image/*']
});

/**
 * The thumbnails store
 * @type {UploadFS.store.Local}
 */
export const ThumbnailStore = new UploadFS.store.Local({
    collection: Thumbnails,
    name: 'thumbnails',
    path: './uploads/thumbnails',
    filter: ThumbnailFilter,
    onRead: FileReadHandler,
    transformWrite(from, to, fileId, file) {
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
