"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../errors");
const fs_extra_1 = __importDefault(require("fs-extra"));
const normalizePath_1 = __importDefault(require("../../normalizePath"));
exports.default = (dir) => {
    return new Promise((resolve, reject) => {
        fs_extra_1.default.readdir(dir, (err, list) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    const e = {
                        code: errors_1.NOT_SUCH_FILE_OR_DIRECTORY,
                        path: normalizePath_1.default(err.path ? err.path : ''),
                        error: err
                    };
                    reject(e);
                }
                else {
                    reject(err);
                }
            }
            else {
                const ret = list.map(name => {
                    return { name: name };
                });
                resolve(ret);
            }
        });
    });
};
