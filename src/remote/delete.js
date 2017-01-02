const path = require('path');

module.exports = (list, remoteRoot, deployment) => {
    return new Promise((resolve, reject) => {
        deleteFiles(list, remoteRoot, deployment, resolve, reject);
    });
}

function deleteFiles(list, remoteRoot, deployment, resolve, reject) {
    let fileToDelete = list.pop();
    if(fileToDelete){
        console.log('Try to delete file '+remoteRoot + fileToDelete.name);
        deployment.delete(remoteRoot + fileToDelete.name).then(() => {
            console.log('Removing file '+fileToDelete.name);
            let dirname = path.dirname(remoteRoot + fileToDelete.name);
            deployment.list(dirname).then(files => {
                if(files.length){
                    deleteFiles(list, remoteRoot, deployment, resolve, reject);
                } else {
                    deployment.rmdir(dirname).then(() => {
                        console.log('Removing directory '+dirname);
                        deleteFiles(list, remoteRoot, deployment, resolve, reject);
                    })
                }
            }).catch(e => {
                console.log('Failed to access directory '+dirname);
                deleteFiles(list, remoteRoot, deployment, resolve, reject);
            })
        }).catch(e => {
            console.log('Failed to delete file '+remoteRoot + fileToDelete.name+' with message: '+e.message);
        });
    } else {
        resolve();
    }
}