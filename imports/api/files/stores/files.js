import gm from 'gm';
import {UploadFS} from 'meteor/jalik:ufs';
import {Files} from '../collections/files';
import {FileReadHandler} from '../lib';
import {ThumbnailStore} from '../stores/thumbnails';


/**
 * File filter
 * @type {UploadFS.Filter}
 */
export const FileFilter = new UploadFS.Filter({
    contentTypes: ['image/*', 'audio/*', 'video/*', 'application/*'],
    maxSize: 1024 * 1000 * 10, // 10MB,
    minSize: 1
});

/**
 * File store using local file system
 * @type {UploadFS.store.Local}
 */
export const FileStore = new UploadFS.store.Local({
    collection: Files,
    name: 'files',
    path: './uploads/files',
    filter: FileFilter,
    // Overwrite default permissions
    permissions: new UploadFS.StorePermissions({
        insert(userId, file) {
            console.log(userId, file.userId);
            // allow anyone to upload a file, but check that uploaded file is attached to the user that uploads the file
            return !file.userId || file.userId === userId;
        },
        remove(userId, file) {
            // allow anyone to remove public files, but only owners to remove their files
            return !file.userId || userId === file.userId;
        },
        update(userId, file) {
            // allow anyone to update public files, but only owners to update their files
            return !file.userId || userId === file.userId;
        },
    }),
    onRead: FileReadHandler,
    copyTo: [
        ThumbnailStore
    ],
    transformWrite(from, to, fileId, file) {
        // Modifies images only
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
//     onRead: FileReadHandler,
//     copyTo: [
//         ThumbnailStore
//     ]
// });
