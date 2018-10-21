"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const md5_1 = __importDefault(require("md5"));
const fs_1 = require("fs");
const output_1 = require("./output");
let counter = 0;
const readFileDeep = (file, filename, resolve, reject, curr, limit) => {
    if (curr === limit) {
        reject(new Error('Read file failed ' + limit + 'times: ' + filename));
    }
    fs_1.readFile(filename, (err, buf) => {
        if (err) {
            if (curr > 10) {
                setTimeout(() => {
                    readFileDeep(file, filename, resolve, reject, curr + 1, limit);
                }, 10 * curr);
            }
            else {
                readFileDeep(file, filename, resolve, reject, curr + 1, limit);
            }
        }
        else {
            file.md5 = md5_1.default(buf);
            if (counter % 100 === 0)
                output_1.dot();
            counter++;
            resolve(file);
        }
    });
};
exports.default = (fileList, dir, localRoot) => {
    const newList = [];
    fileList.forEach(file => {
        newList.push(new Promise((resolve, reject) => {
            const filename = path_1.join(dir, localRoot, file.name);
            if (file.type === 'file') {
                readFileDeep(file, filename, resolve, reject, 1, 100);
            }
            else if (file.type === 'dir') {
                resolve(file);
            }
            else {
                reject(new Error('Unknow filetype of ' + filename));
            }
        }));
    });
    return new Promise((resolve, reject) => {
        Promise.all(newList).then(resolve).catch(reject);
    });
};
