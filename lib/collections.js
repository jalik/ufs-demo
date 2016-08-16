/**
 * The collection that contains file meta-data (name, size, url...)
 * @type {Mongo.Collection}
 */
Files = new Mongo.Collection('files');

Files.allow({
    insert: function (userId, file) {
        return true;
    },
    remove: function (userId, file) {
        return (userId === file.userId || !file.userId);
    },
    update: function (userId, file, fields, modifiers) {
        return userId && (userId === file.userId || !file.userId);
    }
});

/**
 * The thumbnails collection
 * @type {Mongo.Collection}
 */
Thumbnails = new Mongo.Collection('thumbnails');

Thumbnails.allow({
    insert: function (userId, file) {
        return false;
    },
    remove: function (userId, file) {
        return false;
    },
    update: function (userId, file, fields, modifiers) {
        return false;
    }
});

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
 * The thumbnails store
 * @type {UploadFS.store.Local}
 */
ThumbnailStore = new UploadFS.store.Local({
    collection: Thumbnails,
    name: 'thumbnails',
    path: '/uploads/thumbnails',
    // permissions: defaultPermissions,
    filter: new UploadFS.Filter({
        extensions: ['gif', 'jpg', 'jpeg', 'png']
    }),
    onRead: function (fileId, file, req, res) {
        if (file.userId && (file.token !== req.query.token)) {
            res.writeHead(403, {"Content-Type": 'text/plain'});
            res.end('Forbidden');
            return false;
        }
    },
    transformWrite: function (from, to, fileId, file) {
        // Resize images
        if (file.type.indexOf('image/') === 0) {
            const gm = Npm.require('gm');
            if (gm) {
                gm(from)
                    .resize(64, 64)
                    .gravity('Center')
                    .extent(64, 64)
                    .quality(75)
                    .stream().pipe(to);
            } else {
                from.pipe(to);
            }
        } else {
            from.pipe(to);
        }
    }
});

/**
 * The Store that contains files
 * @type {UploadFS.store.Local}
 */
FileStore = new UploadFS.store.Local({
    collection: Files,
    name: 'files',
    path: '/uploads/files',
    // permissions: defaultPermissions,
    copyTo: [ThumbnailStore],
    onRead: function (fileId, file, req, res) {
        if (file.userId && (file.token !== req.query.token)) {
            res.writeHead(403, {"Content-Type": 'text/plain'});
            res.end('Forbidden');
            return false;
        }
    }
});

if (Meteor.isServer) {
    // Automatically publish all files
    Meteor.publish('files', function () {
        let fields = {};

        if (!this.userId) {
            fields.userId = null;
        }
        return [
            Files.find(fields),
            Thumbnails.find(fields)
        ];
    });
}
