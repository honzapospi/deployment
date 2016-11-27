const path = require('path');

module.exports = (localList, remoteList, deployment, localRoot, remoteRoot) => {
    return new Promise((resolve, reject) => {
        let uploaded = [];
        upload(localList, remoteList, deployment, uploaded, localRoot, remoteRoot, resolve, reject, 1, localList.length);
    });
}

function upload(localList, remoteList, deployment, uploaded, localRoot, remoteRoot, resolve, reject, counter, total) {
    let fileToUpload = localList.pop();
    if(fileToUpload){
        deployment.uploadFile(localRoot + fileToUpload.name, remoteRoot + fileToUpload.name+'.deployment').then(() => {
            console.log('('+counter+' of '+total+') Uploading file '+fileToUpload.name);
            counter++;
            uploaded.push(fileToUpload);
            remoteList.push(fileToUpload);
            upload(localList, remoteList, deployment, uploaded, localRoot, remoteRoot, resolve, reject, counter, total);
        }).catch(e => {
            if(e.message == 'No such file'){
                let dirname = path.dirname(remoteRoot + fileToUpload.name);
                deployment.mkdir(dirname, true).then(() => {
                    console.log('Creating directory '+dirname);
                    deployment.uploadFile(localRoot + fileToUpload.name, remoteRoot + fileToUpload.name+'.deployment').then(() => {
                        console.log('('+counter+' of '+total+') Uploading file '+fileToUpload.name);
                        counter++;
                        uploaded.push(fileToUpload);
                        remoteList.push(fileToUpload);
                        upload(localList, remoteList, deployment, uploaded, localRoot, remoteRoot, resolve, reject, counter, total);
                    })
                });
            }
        });
    } else {
        resolve(uploaded);
    }
}