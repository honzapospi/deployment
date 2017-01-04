const path = require('path');
const PERMISSION_DENIED = require('./error_messages').PERMISSION_DENIED;
const NO_SUCH_FILE = require('./error_messages').NO_SUCH_FILE;


module.exports = (localList, remoteList, deployment, localRoot, remoteRoot) => {
    return new Promise((resolve, reject) => {
        let uploaded = [];
        upload(localList, remoteList, deployment, uploaded, localRoot, remoteRoot, resolve, reject, 1, localList.length);
    });
}

function upload(localList, remoteList, deployment, uploaded, localRoot, remoteRoot, resolve, reject, counter, total) {
    let fileToUpload = localList.pop();
    if(fileToUpload){
        process.stdout.write("\n"+'('+counter+' of '+total+') Uploading file '+fileToUpload.name);
        deployment.uploadFile(localRoot + fileToUpload.name, remoteRoot + fileToUpload.name+'.deployment').then(() => {
            process.stdout.write('...OK');
            counter++;
            uploaded.push(fileToUpload);
            remoteList.push(fileToUpload);
            upload(localList, remoteList, deployment, uploaded, localRoot, remoteRoot, resolve, reject, counter, total);
        }).catch(e => {
            if(e.message == NO_SUCH_FILE){
                let dirname = path.dirname(remoteRoot + fileToUpload.name);
                deployment.mkdir(dirname, true).then(() => {
                    //process.stdout.write('('+counter+' of '+total+') Uploading file '+fileToUpload.name);
                    deployment.uploadFile(localRoot + fileToUpload.name, remoteRoot + fileToUpload.name+'.deployment').then(() => {
                        process.stdout.write('...OK');
                        counter++;
                        uploaded.push(fileToUpload);
                        remoteList.push(fileToUpload);
                        upload(localList, remoteList, deployment, uploaded, localRoot, remoteRoot, resolve, reject, counter, total);
                    })
                }).catch(e => {
                    if(e.message == PERMISSION_DENIED) {
                        process.stdout.write('...Failed. Permission denied');
                        counter++;
                        upload(localList, remoteList, deployment, uploaded, localRoot, remoteRoot, resolve, reject, counter, total);
                    } else {
                        throw e;
                    }
                });
            } else if(e.message == PERMISSION_DENIED) {
                process.stdout.write('...Failed. Permission denied');
                counter++;
                upload(localList, remoteList, deployment, uploaded, localRoot, remoteRoot, resolve, reject, counter, total);
            } else {
                reject(e);
            }
        });
    } else {
        resolve(uploaded);
    }
}