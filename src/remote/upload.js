const path = require('path');
const PERMISSION_DENIED = require('./error_messages').PERMISSION_DENIED;
const NO_SUCH_FILE = require('./error_messages').NO_SUCH_FILE;
const FILE_EXIST = require('./error_messages').FILE_EXIST;
const tracer = require('../tracer');


module.exports = (localList, remoteList, deployment, localRoot, remoteRoot) => {
    return new Promise((resolve, reject) => {
        let uploaded = [];
        upload(localList, remoteList, deployment, uploaded, localRoot, remoteRoot, resolve, reject, 1, localList.length);
    });
}

function processUpload(localList, remoteList, deployment, uploaded, localRoot, remoteRoot, resolve, reject, counter, total, fileToUpload) {
    deployment.uploadFile(localRoot + fileToUpload.name, remoteRoot + fileToUpload.name + '.deployment').then(() => {
        tracer.processSuccess();
        counter++;
        uploaded.push(fileToUpload);
        remoteList.push(fileToUpload);
        upload(localList, remoteList, deployment, uploaded, localRoot, remoteRoot, resolve, reject, counter, total);
    }).catch(e => {
        if (e.message == NO_SUCH_FILE) {
            let dirname = path.dirname(remoteRoot + fileToUpload.name);
            deployment.mkdir(dirname, true).then(() => {
                processUpload(localList, remoteList, deployment, uploaded, localRoot, remoteRoot, resolve, reject, counter, total, fileToUpload)
            }).catch(e => {
                if (e.message == PERMISSION_DENIED) {
                    processUpload(localList, remoteList, deployment, uploaded, localRoot, remoteRoot, resolve, reject, counter, total, fileToUpload);
                    // tracer.processError(PERMISSION_DENIED);
                    // counter++;
                    // upload(localList, remoteList, deployment, uploaded, localRoot, remoteRoot, resolve, reject, counter, total);
                } else if(e.message == FILE_EXIST){
                    processUpload(localList, remoteList, deployment, uploaded, localRoot, remoteRoot, resolve, reject, counter, total, fileToUpload);
                    // tracer.processError(PERMISSION_DENIED);
                    // counter++;
                    // upload(localList, remoteList, deployment, uploaded, localRoot, remoteRoot, resolve, reject, counter, total);
                } else {
                    throw e;
                }
            });
        } else if (e.message == PERMISSION_DENIED) {
            processUpload(localList, remoteList, deployment, uploaded, localRoot, remoteRoot, resolve, reject, counter, total, fileToUpload);
            // tracer.processError(PERMISSION_DENIED);
            // counter++;
            // upload(localList, remoteList, deployment, uploaded, localRoot, remoteRoot, resolve, reject, counter, total);
        } else {
            reject(e);
        }
    });
}

function upload(localList, remoteList, deployment, uploaded, localRoot, remoteRoot, resolve, reject, counter, total) {
    let fileToUpload = localList.pop();
    if (fileToUpload) {
        tracer.processStart('(' + counter + ' of ' + total + ') Uploading file ' + fileToUpload.name);
        processUpload(localList, remoteList, deployment, uploaded, localRoot, remoteRoot, resolve, reject, counter, total, fileToUpload);
    } else {
        resolve(uploaded);
    }
}