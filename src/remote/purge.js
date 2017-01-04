const rm_files = require('./rm_files');
const PERMISSION_DENIED = require('./error_messages').PERMISSION_DENIED;
const NO_SUCH_FILE = require('./error_messages').NO_SUCH_FILE;
const tracer = require('../tracer');

module.exports = (dirs, deployment, remoteRoot) => {
    return new Promise((resolve, reject) => {
        clear_dirs(dirs, deployment, remoteRoot, resolve, reject)
    });
}

function clear_dirs(dirs, deployment, remoteRoot, resolve, reject){
    let dirToClear = dirs.pop();
    if(dirToClear){
        deployment.list(remoteRoot + dirToClear).then(files => {
            let fullfiles = files.map(file => {
                return remoteRoot + dirToClear + '/'+file.name;
            });
            rm_files(fullfiles, deployment).then(() => {
                clear_dirs(dirs, deployment, remoteRoot, resolve, reject);
            })
        }).catch(e => {
            if(e.message == 'No such file'){
                tracer.warning('Unable to empty directory "'+dirToClear+'". Directory does not exist.');
                clear_dirs(dirs, deployment, remoteRoot, resolve, reject);
            } else
                throw e;
        });
    } else {
        //process.stdout.write("\n");
        resolve(); // purge complete
    }
};