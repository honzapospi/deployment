const PERMISSION_DENIED = require('./error_messages').PERMISSION_DENIED;
const NO_SUCH_FILE = require('./error_messages').NO_SUCH_FILE;
const FILE_IS_DIRECTORY = require('./error_messages').FILE_IS_DIRECTORY;
const tracer = require('../tracer');

module.exports = function(files, deployment){
    return new Promise((resolve, reject) => {
        rm_files(files, deployment, resolve, reject)
    });
}

function rm_files(files, deployment, resolve, reject) {
    let fileToRemove = files.pop();
    if(fileToRemove){
        tracer.processStart('Removing file "'+fileToRemove+'"');
        deployment.delete(fileToRemove).then(() => {
            tracer.processSuccess();
            rm_files(files, deployment, resolve, reject);
        }).catch(e => {
            if(e.message == NO_SUCH_FILE){
                tracer.processError(NO_SUCH_FILE);
                rm_files(files, deployment, resolve, reject);
            } else if(e.message == PERMISSION_DENIED){
                tracer.processError(PERMISSION_DENIED);
                rm_files(files, deployment, resolve, reject);
            } else if(e.message == FILE_IS_DIRECTORY){
                deployment.rmdir(fileToRemove).then(() => {
                    tracer.processSuccess();
                    rm_files(files, deployment, resolve, reject);
                }).catch(e => {
                    if(e.message == PERMISSION_DENIED){
                        tracer.processError(PERMISSION_DENIED)
                        rm_files(files, deployment, resolve, reject);
                    } else {
                        console.log(e.message);
                        throw e;
                    }
                })
            } else {
                console.log(e.message);
                throw e;
            }
        });
    } else {
        resolve(); // all files has been removed
    }
}