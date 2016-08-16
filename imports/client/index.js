// Load styles
import './css/style.css';

// Load templates
import './templates/templates.html';

// Load templates logic
import './templates/templates.js';

// Slow down the transfer to simulate slow connection
UploadFS.config.simulateWriteDelay = 0;
