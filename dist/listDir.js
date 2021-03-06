"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
exports.default = (dir) => {
    return new Promise((resolve, reject) => {
        fs_1.default.readdir(dir, (err, list) => {
            if (err) {
                reject(err);
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
