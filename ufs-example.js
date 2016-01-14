// Slow down the transfer to simulate slow connection
UploadFS.config.simulateUploadDelay = 0;
UploadFS.config.simulateWriteDelay = 500;

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


if (Meteor.isClient) {

    window.uploader = null;

    Template.uploadForm.events({
        'change [type=file]': function (ev) {
            UploadFS.readAsArrayBuffer(ev, function (data, file) {
                window.uploader = new UploadFS.Uploader({
                    data: data,
                    file: file,
                    store: FilesStore
                });
                uploader.start();
            });
        }
    });

    Template.uploadForm.helpers({
        files: function () {
            return Files.find({}, {
                sort: {createdAt: 1, name: 1}
            });
        }
    });

    Template.file.events({
        'click [name=delete]': function (ev) {
            Files.remove(this._id);
        }
    });

    Template.file.helpers({
        formatSize: function (bytes) {
            if (bytes >= 1000000000) {
                return Math.round(bytes / 1000000000) + ' GB';
            }
            if (bytes >= 1000000) {
                return Math.round(bytes / 1000000) + ' MB';
            }
            if (bytes >= 1000) {
                return Math.round(bytes / 1000) + ' KB';
            }
            return bytes + ' B';
        },
        thumb: function () {
            return Thumbs64.findOne({originalId: this._id});
        }
    });
}
