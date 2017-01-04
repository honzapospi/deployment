const tracer = require('../tracer');
const NO_SUCH_FILE = require('./error_messages').NO_SUCH_FILE;

module.exports = (remoteList, deploymentFile, deployment) => {
    return new Promise((resolve, reject) => {
        tracer.printLine('Creating deployment file...');
        deployment.createFile(deploymentFile, JSON.stringify(remoteList)).then(() => {
            resolve();
        }).catch(e => {
            if(e.message == NO_SUCH_FILE){
                tracer.error('Unable to create deployment file. Permission denied'+"\n");
                deployment.close();
            } else {
                throw e;
            }
        });
    })

}