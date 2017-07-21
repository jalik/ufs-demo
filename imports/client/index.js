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
import {Files} from "/imports/api/files/collections/files";
import {Thumbnails} from "/imports/api/files/collections/thumbnails";
import {i18n} from "meteor/jalik:i18n";
import {Template} from "meteor/templating";
import {UploadFS} from "meteor/jalik:ufs";
// Load styles
import "./css/style.css";
// Load templates
import "./templates/templates.html";
// Load templates logic
import "./templates/templates.js";

// Slow down the transfer to simulate slow connection
UploadFS.config.simulateWriteDelay = 0;

// Add translation template helpers
i18n.addBlazeHelpers();

Template.registerHelper("absoluteUrl", function (path) {
    return Meteor.absoluteUrl(path);
});

// Expose collections
window.db = {
    files: Files,
    thumbs: Thumbnails
};
