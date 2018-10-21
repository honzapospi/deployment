"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const normalizePath_1 = __importDefault(require("./normalizePath"));
exports.default = (fileListWithMd5, remoteDeploymentFile) => {
    const ret = {
        toUpload: [],
        toRemove: [],
        remoteDeploymentFile: {}
    };
    // create list to upload
    const newRemoteDeploymentFile = {};
    fileListWithMd5.forEach(localFile => {
        const localPath = normalizePath_1.default(path_1.join(localFile.dir || '', localFile.name));
        if (remoteDeploymentFile[localPath] && remoteDeploymentFile[localPath].type === 'dir') {
            // skip dir
            newRemoteDeploymentFile[localPath] = remoteDeploymentFile[localPath];
            delete remoteDeploymentFile[localPath];
        }
        else if (remoteDeploymentFile[localPath] && remoteDeploymentFile[localPath].type === 'file' && remoteDeploymentFile[localPath].md5 === localFile.md5) {
            // skip same file
            newRemoteDeploymentFile[localPath] = remoteDeploymentFile[localPath];
            delete remoteDeploymentFile[localPath];
        }
        else {
            const add = {
                name: normalizePath_1.default(localPath),
                type: localFile.type
            };
            if (localFile.type === 'file') {
                add.md5 = localFile.md5;
            }
            ret.toUpload.push(add);
            const add2 = { type: localFile.type || 'file' };
            if (localFile.type === 'file') {
                add2.md5 = localFile.md5;
            }
            delete remoteDeploymentFile[localPath];
            newRemoteDeploymentFile[localPath] = add2;
        }
    });
    // create list to delete
    for (let i in remoteDeploymentFile) {
        const npath = normalizePath_1.default(i);
        ret.toRemove.push({
            name: npath,
            md5: remoteDeploymentFile[npath].md5,
            type: remoteDeploymentFile[npath].type
        });
        delete remoteDeploymentFile[npath];
    }
    ret.remoteDeploymentFile = newRemoteDeploymentFile;
    return ret;
};
