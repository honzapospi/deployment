module.exports = function(files, deployment){
    return new Promise((resolve, reject) => {
        rm_files(files, deployment, resolve, reject)
    });
}

function rm_files(files, deployment, resolve, reject) {
    let fileToRemove = files.pop();
    if(fileToRemove){
        deployment.delete(fileToRemove).then(() => {
            console.log('Deleting file '+fileToRemove);
            rm_files(files, deployment, resolve, reject);
        }).catch(e => {
            if(e.message == 'No such file'){
                console.log('Unable to delete file '+fileToRemove+'. File does not exist.');
                rm_files(files, deployment, resolve, reject);
            } else {
                // maybe is a directory
                deployment.rmdir(fileToRemove, true).then(() => {
                    console.log('Deleting directory '+fileToRemove);
                    rm_files(files, deployment, resolve, reject);
                });
            }
        });
    } else {
        resolve(); // all files has been removed
    }
}