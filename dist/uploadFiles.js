"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const output_1 = require("./output");
let counter = 1;
exports.default = (driver, files, dir, localRoot, remoteRoot) => {
    const total = files.length;
    return new Promise((resolve, reject) => {
        const plist = [];
        files.forEach(file => {
            const localFilename = path_1.join(dir, localRoot, file.name);
            const remoteFilename = path_1.join(remoteRoot, file.name);
            if (file.type === 'file') {
                const uploadPromise = new Promise((res, rej) => {
                    driver.uploadFile(localFilename, remoteFilename + '.deployment').then(result => {
                        output_1.info('(' + counter + ' of ' + total + ') UPLOADING ' + file.name);
                        counter++;
                        res(result);
                    }).catch(rej);
                });
                plist.push(uploadPromise);
            }
            else if (file.type === 'dir') {
                const uploadPromise = new Promise((res, rej) => {
                    driver.mkdir(remoteFilename).then(result => {
                        output_1.info('(' + counter + ' of ' + total + ') UPLOADING ' + file.name);
                        counter++;
                        res(result);
                    }).catch(rej);
                });
                plist.push(uploadPromise);
            }
        });
        Promise.all(plist).then(resolve).catch(reject);
    });
};
