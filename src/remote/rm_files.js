module.exports = function(files, deployment){
    return new Promise((resolve, reject) => {
        rm_files(files, deployment, resolve, reject)
    });
}

function rm_files(files, deployment, resolve, reject) {
    let fileToRemove = files.pop();
    if(fileToRemove){
        process.stdout.write("\n"+ 'Removing file "'+fileToRemove+'"');
        deployment.delete(fileToRemove).then(() => {
            process.stdout.write('...OK');
            rm_files(files, deployment, resolve, reject);
        }).catch(e => {
            if(e.message == 'No such file'){
                process.stdout.write('...FAILED. '+'Unable to delete file '+fileToRemove+'. File does not exist.');
                rm_files(files, deployment, resolve, reject);
            } else {
                // maybe is a directory
                deployment.rmdir(fileToRemove, true).then(() => {
                    process.stdout.write('...OK');
                    rm_files(files, deployment, resolve, reject);
                }).catch(e => {
                    process.stdout.write("\n"+'Unable to remove file: '+fileToRemove);
                    deployment.close(); // or continue?
                });
            }
        });
    } else {
        resolve(); // all files has been removed
    }
}