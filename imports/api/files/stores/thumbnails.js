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

import gm from "gm";
import {FileReadHandler} from "../lib";
import {GridFSStore} from "meteor/jalik:ufs-gridfs";
import {LocalStore} from "meteor/jalik:ufs-local";
import {Thumbnails} from "../collections/thumbnails";
import {UploadFS} from "meteor/jalik:ufs";

/**
 * Thumbnail filter
 * @type {UploadFS.Filter}
 */
export const ThumbnailFilter = new UploadFS.Filter({
    contentTypes: ['image/*']
});

/**
 * The thumbnails store
 * @type {UploadFS.store.Local}
 */
export const ThumbnailStore = new UploadFS.store.Local({
    collection: Thumbnails,
    name: 'thumbnails',
    path: './uploads/thumbnails',
    filter: ThumbnailFilter,
    onRead: FileReadHandler,
    permissions: new UploadFS.StorePermissions({}),
    transformWrite(from, to, fileId, file) {
        if (file.type && file.type.startsWith('image/')) {
            const gm = Npm.require('gm');

            if (gm) {
                // Resize image
                gm(from)
                    .resize(64, 64)
                    .gravity('Center')
                    .extent(64, 64)
                    .quality(75)
                    .autoOrient()
                    .stream().pipe(to);
            } else {
                console.error("gm is not installed");
            }
        } else {
            // do nothing
        }
    }
});
