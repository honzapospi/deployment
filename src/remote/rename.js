const PERMISSION_DENIED = require('./error_messages').PERMISSION_DENIED;
const NO_SUCH_FILE = require('./error_messages').NO_SUCH_FILE;

module.exports = (uploaded, remoteRoot, deployment) => {
    return new Promise((resolve, reject) => {
        rename(uploaded, remoteRoot, deployment, resolve, reject, 1, uploaded.length);
    });
};

function rename(uploaded, remoteRoot, deployment, resolve, reject, counter, total){
    let fileToRename = uploaded.pop();
    if(fileToRename){
        // delete destination file before rename
        deployment.delete(remoteRoot + fileToRename.name).then(() => {
            process.stdout.write("\n"+'('+counter+' of '+total+') Renaming file '+fileToRename.name);
            deployment.rename(remoteRoot + fileToRename.name+'.deployment', remoteRoot + fileToRename.name).then(() => {
                process.stdout.write('...OK');
                counter++;
                rename(uploaded, remoteRoot, deployment, resolve, reject, counter, total);
            })
        }).catch(e => {
            if(e.message == 'No such file'){
                process.stdout.write("\n"+'('+counter+' of '+total+') Renaming file '+fileToRename.name);
                deployment.rename(remoteRoot + fileToRename.name+'.deployment', remoteRoot + fileToRename.name).then(() => {
                    process.stdout.write('...OK');
                    counter++;
                    rename(uploaded, remoteRoot, deployment, resolve, reject, counter, total);
                })
            } else {
                throw e;
            }
        });

    } else {
        resolve();
    }
}