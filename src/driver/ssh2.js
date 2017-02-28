var Client = require('ssh2-sftp-client');
const FILE_IS_DIRECTORY = require('../remote/error_messages').FILE_IS_DIRECTORY;
const FILE_EXIST = require('../remote/error_messages').FILE_EXIST;

var SftpDeployment = function(options){
    this.options = options;
    this.sftp = new Client();
};

SftpDeployment.prototype.connect = function(){
    return this.sftp.connect(this.options);
};

SftpDeployment.prototype.list = function(dir){
    return this.sftp.list(dir);
};

SftpDeployment.prototype.uploadFile = function(localFilename, remoteFilename){
    return new Promise((resolve, reject) => {
        this.sftp.put(localFilename, remoteFilename).then(() => {
            resolve();
        }).catch(e => {
            reject(e);
        });
    })
};

SftpDeployment.prototype.mkdir = function (dir) {
    return new Promise((resolve, reject) => {
        this.sftp.mkdir(dir, true).then(() => {
            resolve();
        }).catch(e => {
            if(e.message == 'Invalid parameter'){ // todo check if file exist
                reject({
                    message: FILE_EXIST,
                    e: e
                });
            } else {
                reject(e);
            }
        });
    })
}

SftpDeployment.prototype.rmdir = function (dir) {
    return this.sftp.rmdir(dir, true);
}

SftpDeployment.prototype.createFile = function (filename, content = '') {
    return this.sftp.put(Buffer.from(content), filename);
}

SftpDeployment.prototype.rename = function(from, to){
    return this.sftp.rename(from, to);
}

SftpDeployment.prototype.delete = function(filename){
    return new Promise((fullfil, reject) => {
        this.sftp.delete(filename).then(() => {
            fullfil();
        }).catch((e) => {
            if(e.message == 'Failure'){
                // todo check reason
                reject({
                    message: FILE_IS_DIRECTORY,
                    e: e
                });
            } else {
                reject(e);
            }
        });
    });

}

SftpDeployment.prototype.getFileContent = function(filename){
    return new Promise((fullfil, reject) => {
        var content = '';
        var result = this.sftp.get(filename);
        result.then((stream) => {
            stream.on('data', (data) => {
                content += data;
            });
            stream.on('end', () => { // or close ??
                fullfil(content);
            })
            stream.on('error', (e) => {
                reject(e);
            })
        }).catch(e => reject(e))
    });
};


SftpDeployment.prototype.close = function(){
    this.sftp.end();
};

module.exports = function(config){
    return new SftpDeployment(config);
}