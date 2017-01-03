const path = require('path');

module.exports = (list, remoteRoot, deployment) => {
    return new Promise((resolve, reject) => {
        deleteFiles(list, remoteRoot, deployment, resolve, reject);
    });
}

function deleteFiles(list, remoteRoot, deployment, resolve, reject) {
    let fileToDelete = list.pop();
    if(fileToDelete){
        process.stdout.write("\n"+'Removing file '+fileToDelete.name);
        deployment.delete(remoteRoot + fileToDelete.name).then(() => {
            process.stdout.write('...OK');
            let dirname = path.dirname(remoteRoot + fileToDelete.name);
            deployment.list(dirname).then(files => {
                if(files.length){
                    deleteFiles(list, remoteRoot, deployment, resolve, reject);
                } else {
                    deployment.rmdir(dirname).then(() => {
                        process.stdout.write("\n"+'Removing directory '+dirname);
                        deleteFiles(list, remoteRoot, deployment, resolve, reject);
                    })
                }
            }).catch(e => {
                process.stdout.write("\n"+'Failed to access directory '+dirname);
                deleteFiles(list, remoteRoot, deployment, resolve, reject);
            })
        }).catch(e => {
            process.stdout.write("\n"+'Failed to delete file '+remoteRoot + fileToDelete.name+' with message: '+e.message);
            deleteFiles(list, remoteRoot, deployment, resolve, reject);
        });
    } else {
        resolve();
    }
}