const tracer = require('../tracer');
const NO_SUCH_FILE = require('./error_messages').NO_SUCH_FILE;
const PERMISSION_DENIED = require('./error_messages').PERMISSION_DENIED;

function processCreateFile(remoteList, deploymentFile, deployment, resolve, reject){
    deployment.delete(deploymentFile).then(() => {
        deployment.createFile(deploymentFile, JSON.stringify(remoteList)).then(() => {
            resolve();
        }).catch(e => {
            if(e.message == NO_SUCH_FILE){
                console.log(e.message);
                processCreateFile(remoteList, deploymentFile, deployment, resolve, reject)
                // tracer.error('Unable to create deployment file. Permission denied'+"\n");
                // deployment.close();
            } else if(e.message == PERMISSION_DENIED) {
                console.log(e.message);
                processCreateFile(remoteList, deploymentFile, deployment, resolve, reject)
            } else {
                throw e;
            }
        });
    })
}

module.exports = (remoteList, deploymentFile, deployment) => {
    return new Promise((resolve, reject) => {
        tracer.printLine('Creating deployment file...');
        processCreateFile(remoteList, deploymentFile, deployment, resolve, reject);
    })

}