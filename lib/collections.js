/**
 * The collection that contains file meta-data (name, size, url...)
 * @type {Mongo.Collection}
 */
Files = new Mongo.Collection('files');

Files.allow({
    insert: function () {
        return true;
    },
    update: function () {
        return true;
    },
    remove: function () {
        return true;
    }
});

/**
 * The thumbnails collection
 * @type {Mongo.Collection}
 */
Thumbs64 = new Mongo.Collection('thumbs64');

Thumbs64.allow({
    insert: function () {
        return false;
    },
    update: function () {
        return false;
    },
    remove: function () {
        return false;
    }
});

/**
 * The thumbnails collection
 * @type {Mongo.Collection}
 */
Thumbs48 = new Mongo.Collection('thumbs48');

Thumbs48.allow({
    insert: function () {
        return false;
    },
    update: function () {
        return false;
    },
    remove: function () {
        return false;
    }
});

/**
 * The thumbnails collection
 * @type {Mongo.Collection}
 */
Thumbs24 = new Mongo.Collection('thumbs24');

Thumbs24.allow({
    insert: function () {
        return false;
    },
    update: function () {
        return false;
    },
    remove: function () {
        return false;
    }
});

/**
 * The Store that contains files
 * @type {UploadFS.store.Local}
 */
FilesStore = new UploadFS.store.Local({
    collection: Files,
    name: 'files',
    path: '/uploads/files',
    copyTo: [
        new UploadFS.store.Local({
            collection: Thumbs64,
            name: 'thumbs64',
            path: '/uploads/thumbs_64',
            filter: new UploadFS.Filter({
                extensions: ['gif', 'jpg', 'png']
            }),
            //onRead: function (fileId, file, req, res) {
            //    res.writeHead(403);
            //    return false;
            //},
            transformWrite: function (from, to, fileId, file) {
                // Resize images
                if (file.type.indexOf('image/') === 0) {
                    var gm = Npm.require('gm');
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
            },
            copyTo: [
                new UploadFS.store.Local({
                    collection: Thumbs24,
                    name: 'thumbs24',
                    path: '/uploads/thumbs_24',
                    filter: new UploadFS.Filter({
                        extensions: ['gif', 'jpg', 'png']
                    }),
                    transformWrite: function (from, to, fileId, file) {
                        // Resize images
                        if (file.type.indexOf('image/') === 0) {
                            var gm = Npm.require('gm');
                            if (gm) {
                                gm(from)
                                    .resize(24, 24)
                                    .gravity('Center')
                                    .extent(24, 24)
                                    .quality(75)
                                    .stream().pipe(to);
                            } else {
                                from.pipe(to);
                            }
                        } else {
                            from.pipe(to);
                        }
                    }
                })
            ]
        }),
        new UploadFS.store.Local({
            collection: Thumbs48,
            name: 'thumbs48',
            path: '/uploads/thumbs_48',
            transformWrite: function (from, to, fileId, file) {
                // Resize images
                if (file.type.indexOf('image/') === 0) {
                    var gm = Npm.require('gm');
                    if (gm) {
                        gm(from)
                            .resize(48, 48)
                            .gravity('Center')
                            .extent(48, 48)
                            .quality(75)
                            .stream().pipe(to);
                    } else {
                        from.pipe(to);
                    }
                } else {
                    from.pipe(to);
                }
            }
        })
    ]
});

if (Meteor.isServer) {
    // Automatically publish all files
    Meteor.publish(null, function () {
        return [
            Files.find(),
            Thumbs24.find(),
            Thumbs48.find(),
            Thumbs64.find()
        ];
    });
}
