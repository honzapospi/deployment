const path = require('path');
const PERMISSION_DENIED = require('./error_messages').PERMISSION_DENIED;
const NO_SUCH_FILE = require('./error_messages').NO_SUCH_FILE;
const tracer = require('../tracer');

module.exports = (list, remoteRoot, deployment) => {
    return new Promise((resolve, reject) => {
        deleteFiles(list, remoteRoot, deployment, resolve, reject);
    });
}

function deleteFiles(list, remoteRoot, deployment, resolve, reject) {
    let fileToDelete = list.pop();
    if(fileToDelete){
        tracer.processStart('Removing file '+fileToDelete.name)
        deployment.delete(remoteRoot + fileToDelete.name).then(() => {
            tracer.processSuccess();
            let dirname = path.dirname(remoteRoot + fileToDelete.name);
            deployment.list(dirname).then(files => {
                if(files.length){
                    deleteFiles(list, remoteRoot, deployment, resolve, reject);
                } else {
                    tracer.processStart('Removing directory '+dirname);
                    deployment.rmdir(dirname).then(() => {
                        tracer.processSuccess();
                        deleteFiles(list, remoteRoot, deployment, resolve, reject);
                    }).catch(e => {
                        if(e.message == PERMISSION_DENIED){
                            tracer.processError(PERMISSION_DENIED);
                            deleteFiles(list, remoteRoot, deployment, resolve, reject);
                        } else {
                            throw e;
                        }
                    })
                }
            })
        }).catch(e => {
            if(e.message == NO_SUCH_FILE){
                tracer.processError(NO_SUCH_FILE);
                deleteFiles(list, remoteRoot, deployment, resolve, reject);
            } else if (e.message == PERMISSION_DENIED){
                tracer.processError(PERMISSION_DENIED);
                deleteFiles(list, remoteRoot, deployment, resolve, reject);
            } else {
                throw e;
            }
        });
    } else {
        resolve();
    }
}