"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const output_1 = require("./output");
let counter = 1;
exports.default = (driver, files, remoteRoot) => {
    const filesOnly = files.filter(file => {
        return file.type === 'file';
    });
    const total = filesOnly.length;
    return new Promise((resolve, reject) => {
        const plist = [];
        filesOnly.forEach(file => {
            const remoteFilename = path_1.join(remoteRoot, file.name);
            const renameFilePromise = new Promise((res, rej) => {
                driver.rename(remoteFilename + '.deployment', remoteFilename).then(result => {
                    output_1.info('(' + counter + ' of ' + total + ') RENAMING ' + file.name);
                    res(result);
                    counter++;
                }).catch(rej);
            });
            plist.push(renameFilePromise);
        });
        Promise.all(plist).then(resolve).catch(reject);
    });
};
