import {i18n} from 'meteor/jalik:i18n';
import {UploadFS} from 'meteor/jalik:ufs';


// Load styles
import './css/style.css';

// Load templates
import './templates/templates.html';

// Load templates logic
import './templates/templates.js';

// Slow down the transfer to simulate slow connection
UploadFS.config.simulateWriteDelay = 0;

// Add translation template helpers
i18n.addBlazeHelpers();
