"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const list = (dir) => {
    return new Promise((resolve, reject) => {
        resolve([
            { name: 'file1.txt' },
            { name: 'file2.txt' },
            { name: 'dir' }
        ]);
    });
};
const getFileContent = (filename) => {
    return new Promise((resolve, reject) => {
    });
};
const uploadFile = (localFilename, remoteFilename) => {
    return new Promise((resolve, reject) => {
    });
};
const mkdir = (dir) => {
    return new Promise((resolve, reject) => {
    });
};
const rename = (from, to) => {
    return new Promise((resolve, reject) => {
    });
};
const remove = (filename) => {
    return new Promise((resolve, reject) => {
    });
};
const rmdir = (dir) => {
    return new Promise((resolve, reject) => {
    });
};
exports.default = {
    list,
    getFileContent,
    uploadFile,
    mkdir,
    rename,
    remove,
    rmdir
};
