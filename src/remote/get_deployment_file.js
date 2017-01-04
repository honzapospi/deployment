const PERMISSION_DENIED = require('./error_messages').PERMISSION_DENIED;
const NO_SUCH_FILE = require('./error_messages').NO_SUCH_FILE;
const tracer = require('../tracer');

module.exports = function (filename, deployment) {
    return new Promise((resolve, reject) => {
        deployment.getFileContent(filename).then(content => {
            if(content){
                tracer.printLine('Deployment file ok.');
                resolve(JSON.parse(content));
            } else {
                tracer.printLine('Deployment file not found or empty.');
                resolve([]);
            }
        }).catch(e => {
            if(e.message == NO_SUCH_FILE){
                tracer.printLine('Deployment file not found.');
                resolve([]);
            } else {
                throw e;
            }
        })
    });
}