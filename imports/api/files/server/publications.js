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

import _ from 'underscore';
import {Meteor} from 'meteor/meteor';
import {Files} from '../collections/files';
import {Thumbnails} from '../collections/thumbnails';


// Publish files and thumbnails
Meteor.publish('files', function (fields, options) {
    fields = _.extend({}, fields, {});
    options = _.extend({}, options, {});

    if (!this.userId) {
        // Publish only public files
        // with no userId attached.
        fields.userId = null;
    }
    return [
        Files.find(fields, options),
        Thumbnails.find(fields, options)
    ];
});
