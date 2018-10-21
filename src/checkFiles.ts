import {join} from 'path';
import normalizePath from './normalizePath';

type ProcessList = {
    toUpload: FileMeta[],
    toRemove: FileMeta[],
    remoteDeploymentFile: {}
}


export default (fileListWithMd5: FileMeta[], remoteDeploymentFile: DeploymentFile) => {
    const ret: ProcessList = {
        toUpload: [],
        toRemove: [],
        remoteDeploymentFile: {}
    };
    // create list to upload
    const newRemoteDeploymentFile: DeploymentFile = {};
    fileListWithMd5.forEach(localFile => {
        const localPath = normalizePath(join(localFile.dir || '', localFile.name));
        if(remoteDeploymentFile[localPath] && remoteDeploymentFile[localPath].type === 'dir'){
            // skip dir
            newRemoteDeploymentFile[localPath] = remoteDeploymentFile[localPath];
            delete remoteDeploymentFile[localPath];
        } else if (remoteDeploymentFile[localPath] && remoteDeploymentFile[localPath].type === 'file' && remoteDeploymentFile[localPath].md5 === localFile.md5){
            // skip same file
            newRemoteDeploymentFile[localPath] = remoteDeploymentFile[localPath];
            delete remoteDeploymentFile[localPath];
        } else {
            const add: FileMeta = {
                name: normalizePath(localPath),
                type: localFile.type
            };
            if(localFile.type === 'file'){
                add.md5 = localFile.md5
            }
            ret.toUpload.push(add);
            const add2:DeploymentData = {type: localFile.type || 'file' };
            if(localFile.type === 'file'){
                add2.md5 = localFile.md5;
            }
            delete remoteDeploymentFile[localPath];
            newRemoteDeploymentFile[localPath] = add2;
        }
    })
    // create list to delete
    for(let i in remoteDeploymentFile){
        const npath = normalizePath(i);
        ret.toRemove.push({
            name: npath,
            md5: remoteDeploymentFile[npath].md5,
            type: remoteDeploymentFile[npath].type
        });
        delete remoteDeploymentFile[npath];
    }
    ret.remoteDeploymentFile = newRemoteDeploymentFile;
    return ret;
}