"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const errors_1 = require("./driver/errors");
const output_1 = require("./output");
exports.default = (driver, purge, remoteRoot) => {
    return new Promise((resolve, reject) => {
        const plist = [];
        purge.forEach(path => {
            const dir = path_1.join(remoteRoot, path);
            const dirPromise = new Promise((res, rej) => {
                driver.list(dir).then(result => {
                    output_1.info('Purging directory ' + dir);
                    const result2 = result.map(file => {
                        return { name: path_1.join(dir, file.name) };
                    });
                    res(result2);
                }).catch(error => {
                    if (error.code == errors_1.NOT_SUCH_FILE_OR_DIRECTORY) {
                        output_1.warning('Unable to purge directory "' + path + '". Directory not exist.');
                        res([]);
                    }
                    else {
                        rej(error);
                    }
                });
            });
            plist.push(dirPromise);
        });
        const plist2 = [];
        Promise.all(plist).then(filelist => {
            filelist.forEach(dirList => {
                dirList.forEach(file => {
                    plist2.push(removeFile(driver, file.name));
                });
            });
            Promise.all(plist2).then(result => {
                resolve(true);
            }).catch(reject);
        }).catch(reject);
    });
};
const removeFile = (driver, name) => {
    return new Promise((resolve, reject) => {
        driver.remove(name).then(result => {
            resolve(true);
        }).catch(error => {
            if (error.code === errors_1.FILE_IS_DIRECTORY) {
                driver.rmdir(name).then(result => {
                    resolve(true);
                }).catch(reject);
            }
            else if (error.code === errors_1.PERMISSION_DENIED) {
                output_1.error('Unable to purge directory "' + name + '". Permission denied.');
                resolve(true);
            }
            else {
                reject(error);
            }
        });
    });
};
