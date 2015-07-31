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

FilesStore = new UploadFS.store.Local({
    name: 'files',
    collection: Files
});

if (Meteor.isClient) {
    Template.uploadForm.events({
        'change [type=file]': function (ev) {
            UploadFS.readAsArrayBuffer(ev, function (data, file) {
                new UploadFS.Uploader({
                    data: data,
                    file: file,
                    store: FilesStore
                }).start();
            });
        }
    });

    Template.uploadForm.helpers({
        files: function () {
            return Files.find({}, {sort: {createdAt: -1}});
        }
    });

    Template.file.events({
        'click [name=delete]': function (ev) {
            Files.remove(this._id);
        }
    });
}