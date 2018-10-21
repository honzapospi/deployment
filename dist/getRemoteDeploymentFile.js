"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("./driver/errors");
exports.default = (driver, file) => {
    return new Promise((resolve, reject) => {
        driver.getFileContent(file).then(content => {
            resolve(JSON.parse(content));
        }).catch(error => {
            if (error.code === errors_1.NOT_SUCH_FILE_OR_DIRECTORY) {
                resolve({});
            }
            else {
                reject(error);
            }
        });
    });
};
