"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const logger_1 = __importDefault(require("../../logger"));
const errors_1 = require("../errors");
const list_1 = __importDefault(require("./list"));
const validateConfig_1 = __importDefault(require("./validateConfig"));
const getFileContent = (filename) => {
    return new Promise((resolve, reject) => {
        fs_extra_1.default.readFile(filename, 'utf-8', (err, data) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    const e = {
                        code: errors_1.NOT_SUCH_FILE_OR_DIRECTORY,
                        path: err.path,
                        error: err
                    };
                    reject(e);
                }
                else {
                    logger_1.default(err);
                    reject(err);
                }
            }
            else
                resolve(data);
        });
    });
};
const uploadFile = (localFilename, remoteFilename) => {
    return new Promise((resolve, reject) => {
        fs_extra_1.default.copy(localFilename, remoteFilename, (err) => {
            if (err)
                reject(err);
            else
                resolve(true);
        });
    });
};
const mkdir = (dir) => {
    return new Promise((resolve, reject) => {
        fs_extra_1.default.mkdirs(dir, (err) => {
            if (err)
                reject(err);
            else
                resolve(true);
        });
    });
};
const rename = (from, to) => {
    return new Promise((resolve, reject) => {
        fs_extra_1.default.rename(from, to, (err) => {
            if (err)
                reject(err);
            else
                resolve(true);
        });
    });
};
const remove = (filename) => {
    return new Promise((resolve, reject) => {
        if (fs_extra_1.default.existsSync(filename)) {
            fs_extra_1.default.unlink(filename, (err) => {
                if (err) {
                    if (err.code === 'EISDIR') {
                        const e = {
                            code: errors_1.FILE_IS_DIRECTORY,
                            path: err.path,
                            error: err
                        };
                        reject(e);
                    }
                    else if (err.code === 'EACCES') { // permission denied on file
                        const e = {
                            code: errors_1.PERMISSION_DENIED,
                            path: err.path,
                            error: err
                        };
                        reject(e);
                    }
                    else if (err.code === 'EPERM') { // permission denied on dir
                        const e = {
                            code: errors_1.PERMISSION_DENIED,
                            path: err.path,
                            error: err
                        };
                        reject(e);
                    }
                    else {
                        reject(err);
                    }
                }
                else
                    resolve(true);
            });
        }
        else {
            resolve(true);
        }
    });
};
const rmdir = (dir) => {
    return new Promise((result, reject) => {
        fs_extra_1.default.remove(dir, (err) => {
            if (err)
                reject(err); // TODO check permission denied
            else
                result(true);
        });
    });
};
const createFile = (filename, contents) => {
    return new Promise((resolve, reject) => {
        fs_extra_1.default.writeFile(filename, contents, 'utf8', (err) => {
            if (err)
                reject(err);
            else
                resolve(true);
        });
    });
};
const connect = () => {
    return new Promise((resolve, reject) => {
        resolve(true);
    });
};
exports.default = {
    getFileContent,
    uploadFile,
    mkdir,
    rename,
    remove,
    rmdir,
    createFile,
    connect,
    list: list_1.default,
    validateConfig: validateConfig_1.default
};
