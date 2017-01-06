const fs  = require('fs-extra');
const PERMISSION_DENIED = require('../remote/error_messages').PERMISSION_DENIED;
const FILE_IS_DIRECTORY = require('../remote/error_messages').FILE_IS_DIRECTORY;

class Local {
    connect(){
        return new Promise((resolve, reject) => {
            resolve();
        });
    }

    getFileContent(filename){
        return new Promise((resolve, reject) => {
            fs.readFile(filename, 'utf-8', (err, data) => {
                resolve(data);
             })
        })
    }

    uploadFile(localFilename, remoteFilename){
        return new Promise((result, reject) => {
            fs.copy(localFilename, remoteFilename, (err) => {
                if(err)
                    reject(err);
                else
                    result();
            });
        });
    }

    mkdir(dir){
        return new Promise((result, reject) => {
            fs.mkdirs(dir, (err) => {
                if(err)
                    reject(err);
                else
                    result();
            })
        })
    }

    rmdir(dir) {
        return new Promise((result, reject) => {
            fs.remove(dir, (err) => {
                if(err)
                    reject(err);
                else
                    result();
            });
        })
    }

    createFile(filename, content = ''){
        return new Promise((resolve, reject) => {
            fs.writeFile(filename, content, 'utf8', (err) => {
                if(err)
                    reject(err);
                else
                    resolve();
            })
        });
    }

    rename(from, to){
        return new Promise((resolve, reject) => {
            fs.rename(from, to, (err) => {
                if(err)
                    reject(err);
                else
                    resolve();
            });
        });
    }

    delete(filename){
        return new Promise((resolve, reject) => {
            if(fs.existsSync(filename)){
                fs.unlink(filename, (err) => {
                    if(err){
                        // check if file is a directory
                        if(fs.lstatSync(filename).isDirectory()){
                            reject({
                                message: FILE_IS_DIRECTORY,
                                e: err
                            });
                        } else if(err.message.substr(0, 5) == 'EPERM'){
                            reject({
                                message: PERMISSION_DENIED,
                                e: err
                            })
                        } else {
                            reject(err);
                        }
                    }
                    else {
                        resolve();
                    }
                });
            } else {
                resolve();
            }
        });
    }

    list(dir){
        return new Promise((resolve, reject) => {
            fs.readdir(dir, (err, list) => {
                if(err){
                    if(err.code == 'ENOENT')
                        reject({message: 'No such file'});
                    else
                        reject(e);
                }
                else {
                    resolve(list.map(name => {
                        return {name: name}
                    }))
                }
            });
        });
    }

    close(){

    }
}

module.exports = function(config){
    return new Local(config);
}