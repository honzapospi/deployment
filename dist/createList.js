"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = require("path");
const listDir_1 = __importDefault(require("./listDir"));
const isFileIgnored_1 = __importDefault(require("./isFileIgnored"));
const output_1 = require("./output");
const normalizePath_1 = __importDefault(require("./normalizePath"));
const FILE = 'file';
const DIR = 'dir';
exports.default = (dir, localRoot, ignore) => {
    return new Promise((resolve, reject) => {
        getDirMeta('/', dir, localRoot).then(dirMeta => {
            const newList = [];
            addFilesToList(newList, dirMeta, ignore);
            resolve(newList);
        }).catch(reject);
    });
};
const addFilesToList = (list, dir, ignore) => {
    if (dir.files) {
        dir.files.forEach(file => {
            if (isFileIgnored_1.default(file.name, ignore)) {
                output_1.info('Ignoring ' + file.name);
                return;
            }
            if (file.type === FILE) {
                list.push(file);
            }
            else if (file.type === DIR) {
                list.push(file);
                addFilesToList(list, file, ignore);
            }
            else {
                throw new Error('Invalid type');
            }
        });
    }
};
const getFileMeta = (name) => {
    return new Promise((resolve, reject) => {
        resolve({
            name: normalizePath_1.default(name),
            type: FILE
        });
    });
};
const getDirMeta = (name, dir, localRoot) => {
    return new Promise((resolve, reject) => {
        const dirname = path_1.join(dir, localRoot, name);
        const ret = {
            name: normalizePath_1.default(name),
            type: DIR
        };
        listDir_1.default(dirname).then(filelist => {
            const newList = [];
            filelist.forEach(file => {
                const filename = path_1.join(dirname, file.name);
                const meta = fs_extra_1.default.lstatSync(filename);
                if (meta.isDirectory()) {
                    newList.push(getDirMeta(path_1.join(name, file.name), dir, localRoot));
                }
                else if (meta.isFile()) {
                    newList.push(getFileMeta(path_1.join(name, file.name)));
                }
                else {
                    // only files and directories are uploaded
                    // @see: https://nodejs.org/api/fs.html#fs_class_fs_stats for other file types
                }
            });
            Promise.all(newList).then(result => {
                ret.files = result;
                resolve(ret);
            }).catch(reject);
        }).catch(reject);
    });
};
