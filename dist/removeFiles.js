"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const output_1 = require("./output");
let counter = 1;
exports.default = (driver, files, remoteRoot) => {
    const total = files.length;
    return new Promise((resolve, reject) => {
        const plist = [];
        files.forEach(file => {
            const filename = path_1.join(remoteRoot, file.name);
            if (file.type === 'file') {
                const removeFilePromise = new Promise((res, rej) => {
                    driver.remove(filename).then(result => {
                        output_1.info('(' + counter + ' of ' + total + ') REMOVING ' + file.name);
                        res(result);
                    }).catch(rej);
                });
                plist.push(removeFilePromise);
            }
            else if (file.type === 'dir') {
                const removeDirPromise = new Promise((res, rej) => {
                    driver.rmdir(filename).then(result => {
                        output_1.info('(' + counter + ' of ' + total + ') REMOVING ' + file.name);
                        res(result);
                    }).catch(rej);
                });
                plist.push(removeDirPromise);
            }
        });
        Promise.all(plist).then(resolve).catch(reject);
    });
};
