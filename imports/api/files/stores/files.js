/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 Karl STEIN
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */
import gm from 'gm';
import { UploadFS } from 'meteor/jalik:ufs';
import { GridFSStore } from 'meteor/jalik:ufs-gridfs';
import { Files } from '../collections/files';
import { FileReadHandler } from '../lib';
import { ThumbnailStore } from './thumbnails';

const DEBUG = false;

/**
 * File filter
 * @type {UploadFS.Filter}
 */
export const FileFilter = new UploadFS.Filter({
  contentTypes: ['text/plain', 'image/*', 'audio/*', 'video/*', 'application/*'],
  maxSize: 1024 * 1000 * 10, // 10MB,
  minSize: 1,
  onCheck(file) {
    // Custom checks
    console.log(`Filter.onCheck`, file);
    return true;
  },
});

/**
 * File store using local file system
 * @type {UploadFS.store.GridFS}
 */
export const FileStore = new GridFSStore({
  collection: Files,
  name: 'files',
  path: './uploads/files',
  filter: FileFilter,
  // Overwrite default permissions
  permissions: new UploadFS.StorePermissions({
    insert(userId, file) {
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
  copyTo: [
    ThumbnailStore,
  ],
  onCopyError(err, fileId, file) {
    DEBUG && console.log(`Store.onCopyError`, file);
    console.error('onCopyError', err);
  },
  onFinishUpload(file) {
    DEBUG && console.log(`Store.onFinishUpload`, file);
  },
  onRead(fileId, file, request, response) {
    DEBUG && console.log(`Store.onRead`, file);
    FileReadHandler(fileId, file, request, request);
  },
  onReadError(err, fileId, file) {
    DEBUG && console.log(`Store.onReadError`, file);
    console.error('onReadError', err);
  },
  onWriteError(err, fileId, file) {
    DEBUG && console.log(`Store.onWriteError`, file);
    console.error('onWriteError', err);
  },
  onValidate(file) {
    DEBUG && console.log(`Store.onValidate`, file);
    // if something is wrong, throw an error
    // throw new Meteor.Error('invalid-file-for-x-reason');
  },
  transformWrite(from, to, fileId, file) {
    // Modifies images only
    if (file.type && file.type.startsWith('image/')) {
      if (gm) {
        gm(from)
          .quality(90)
          .autoOrient()
          .stream().pipe(to);
      } else {
        console.error('gm is not installed');
      }
    } else {
      from.pipe(to);
    }
  },
});
