import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {UploadFS} from 'meteor/jalik:ufs';
import {Files} from '/imports/api/files/collections/files';
import {Thumbnails} from '/imports/api/files/collections/thumbnails';


window.workers = {};

const deleteFiles = function (filter) {
    Meteor.call('deleteFiles', filter, function (err, result) {
        if (err) {
            console.error(err);
        } else if (result) {
            console.log(`${result} files have been deleted`);
        }
    });
};

Template.header.events({
    'click [name=delete-files]'(ev) {
        ev.preventDefault();
        deleteFiles({});
    },
    'click [name=delete-public-files]'(ev) {
        ev.preventDefault();
        deleteFiles({userId: null});
    },
    'click [name=delete-private-files]'(ev) {
        ev.preventDefault();
        deleteFiles({userId: {$ne: null}});
    }
});

Template.uploadForm.events({
    'click [name=import]'(ev, tpl) {
        ev.preventDefault();
        let url = window.prompt("URL to load:");

        if (url) {
            UploadFS.importFromURL(url, {}, 'files', function (err, file) {
                if (err) {
                    console.error(err);
                } else if (file) {
                    tpl.$('[name=url]').val('');
                    console.log('file successfully imported : ', file);
                }
            });
        }
    },
    'click [name=upload]'(ev, tpl) {
        ev.preventDefault();

        // Open selection dialog for multiple files
        UploadFS.selectFiles(function (file) {
            const ONE_MB = 1024 * 1000;

            // Prepare uploader for each file to upload
            const uploader = new UploadFS.Uploader({
                adaptive: true,// use adaptive transfer speed
                chunkSize: ONE_MB,// default chunk size
                maxChunkSize: ONE_MB * 10,
                data: file,
                file: file,
                store: 'files',// where the file will be stored
                maxTries: 3
            });
            uploader.onAbort = function (file) {
                console.info(`${file.name} upload aborted`);
            };
            uploader.onComplete = function (file) {
                let time = (this.getElapsedTime() / 1000).toFixed(2);
                let avgSpeed = (this.getAverageSpeed() / 1024).toFixed(2);
                console.info(`${file.name} upload completed in ${time}s @ ${avgSpeed}KB/s`);
            };
            uploader.onCreate = function (file) {
                console.info(`${file.name} created`);
                workers[file._id] = this;
            };
            uploader.onError = function (err, file) {
                let message = `${file.name} could not be uploaded : ${err.message}`;
                console.error(message);
                console.error('ERROR:', err);
                console.error(err.stack);
                window.alert(message)
            };
            uploader.onProgress = function (file, progress) {
                console.info(file.name + ' :'
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

Template.fileTable.onCreated(function () {
    this.subscribe('files');
});

Template.fileTable.helpers({
    files() {
        return Files.find({}, {
            sort: {createdAt: 1, name: 1}
        });
    }
});

Template.fileTableRow.events({
    'click [name=delete]'(ev) {
        ev.preventDefault();
        Files.remove(this._id, (err, result) => {
            if (err) {
                console.error(err);
            } else {
                console.log(`delete result: ${result}`);
            }
        });
    },
    'click [name=abort]'(ev) {
        ev.preventDefault();
        workers[this._id].abort();
    },
    'click [name=stop]'(ev) {
        ev.preventDefault();
        workers[this._id].stop();
    },
    'click [name=start]'(ev) {
        ev.preventDefault();
        workers[this._id].start();
    }
});

Template.fileTableRow.helpers({
    canAbort() {
        return workers.hasOwnProperty(this._id);
    },
    canDelete() {
        let userId = Meteor.userId();
        return userId === this.userId || !this.userId;
    },
    formatSize(bytes) {
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
    progress() {
        return Math.round(this.progress * 10000) / 100;
    },
    thumb() {
        return Thumbnails.findOne({originalId: this._id});
    }
});
