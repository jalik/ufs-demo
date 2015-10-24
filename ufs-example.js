// Slow down the transfer to simulate slow connection
UploadFS.config.simulateWriteDelay = 3000;

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
 * The Store that contains files
 * @type {UploadFS.store.Local}
 */
FilesStore = new UploadFS.store.Local({
    name: 'files',
    collection: Files
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
                sort: {createdAt: 1}
            });
        }
    });

    Template.file.events({
        'click [name=delete]': function (ev) {
            Files.remove(this._id);
        }
    });
}