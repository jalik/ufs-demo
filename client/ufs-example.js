// Slow down the transfer to simulate slow connection
UploadFS.config.simulateWriteDelay = 0;

window.workers = {};

Template.uploadForm.events({
    'click [name=upload]': function (ev, tpl) {
        ev.preventDefault();

        UploadFS.selectFiles(function (file) {
            var uploader = new UploadFS.Uploader({
                chunkSize: 5 * 1024 * 1000,
                maxChunkSize: 5 * 1024 * 1000,
                data: file,
                file: file,
                store: FilesStore
            });
            uploader.onCreate = function (file) {
                workers[file._id] = this;
            };
            uploader.onProgress = function (file, progress) {
                console.log(file.name + ' :'
                    + "\n" + (progress * 100).toFixed(2) + '%'
                    + "\n" + (this.getSpeed() / 1024).toFixed(2) + 'KB/s'
                    + "\n" + 'elapsed: ' + (this.getElapsedTime() / 1000).toFixed(2) + 's'
                    + "\n" + 'remaining: ' + (this.getRemainingTime() / 1000).toFixed(2) + 's'
                );
            };
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
            return (bytes / 1000000000).toFixed(2) + ' GB';
        }
        if (bytes >= 1000000) {
            return (bytes / 1000000).toFixed(2) + ' MB';
        }
        if (bytes >= 1000) {
            return (bytes / 1000).toFixed(2) + ' KB';
        }
        return bytes + ' B';
    },
    progress: function () {
        return (this.progress * 100).toFixed(2);
    },
    thumb: function () {
        return Thumbs64.findOne({originalId: this._id});
    }
});
