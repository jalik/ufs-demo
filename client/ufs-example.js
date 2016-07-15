// Slow down the transfer to simulate slow connection
UploadFS.config.simulateWriteDelay = 500;

window.workers = {};

Template.uploadForm.events({
    'click [name=upload]': function (ev, tpl) {
        ev.preventDefault();

        var callback = function (ev) {
            UploadFS.readAsArrayBuffer(ev, function (data, file) {
                var uploader = new UploadFS.Uploader({
                    data: data,
                    file: file,
                    store: FilesStore
                });

                // Remove uploader on complete
                uploader.onComplete = function () {
                    delete workers[file.name];
                };
                // Remember uploader
                tpl.autorun(function () {
                    uploader.getProgress();
                    if (uploader.getFile()._id) {
                        workers[uploader.getFile()._id] = uploader;
                    }
                });
                uploader.start();
            });
        };

        var input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.onchange = callback;
        input.click();
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
        ev.preventDefault();
        Files.remove(this._id);
    },
    'click [name=abort]': function (ev) {
        ev.preventDefault();
        workers[this._id].abort();
    },
    'click [name=stop]': function (ev) {
        ev.preventDefault();
        workers[this._id].stop();
    },
    'click [name=start]': function (ev) {
        ev.preventDefault();
        workers[this._id].start();
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
