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
        process.stdout.write("\n"+'('+counter+' of '+total+') Uploading file '+fileToUpload.name);
        deployment.uploadFile(localRoot + fileToUpload.name, remoteRoot + fileToUpload.name+'.deployment').then(() => {
            process.stdout.write('...OK');
            counter++;
            uploaded.push(fileToUpload);
            remoteList.push(fileToUpload);
            upload(localList, remoteList, deployment, uploaded, localRoot, remoteRoot, resolve, reject, counter, total);
        }).catch(e => {
            if(e.message == 'No such file'){
                let dirname = path.dirname(remoteRoot + fileToUpload.name);
                deployment.mkdir(dirname, true).then(() => {
                    process.stdout.write('('+counter+' of '+total+') Uploading file '+fileToUpload.name);
                    deployment.uploadFile(localRoot + fileToUpload.name, remoteRoot + fileToUpload.name+'.deployment').then(() => {
                        process.stdout.write('...OK'+"\n");
                        counter++;
                        uploaded.push(fileToUpload);
                        remoteList.push(fileToUpload);
                        upload(localList, remoteList, deployment, uploaded, localRoot, remoteRoot, resolve, reject, counter, total);
                    })
                }).catch(e => {
                    if(e.message.substr(0, 25) == 'EACCES: permission denied') {
                        process.stdout.write('...Failed. Permission denied'+"\n");
                        upload(localList, remoteList, deployment, uploaded, localRoot, remoteRoot, resolve, reject, counter, total);
                    } else {
                        process.stdout.write("\n"+'Unable to create directory "'+dirname+'". '+e.message+'.');
                        deployment.close();
                    }
                });
            } else if(e.message.substr(0, 25) == 'EACCES: permission denied') {
                process.stdout.write('...Failed. Permission denied'+"\n");
                upload(localList, remoteList, deployment, uploaded, localRoot, remoteRoot, resolve, reject, counter, total);
            } else {
                reject(e);
            }
        });
    } else {
        resolve(uploaded);
    }
}