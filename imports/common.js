/**
 * Callback called when a file is about to be served
 * @param fileId
 * @param file
 * @param req
 * @param res
 * @returns {boolean}
 * @constructor
 */
FileReadHandler = function (fileId, file, req, res) {
    // Deny access if file is private and token is not valid
    if (file.userId && (file.token !== req.query.token)) {
        res.writeHead(403, {"Content-Type": 'text/plain'});
        res.end('Forbidden');
        return false;
    }
};
