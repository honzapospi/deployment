"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
exports.default = (driver, deploymentFile, deploymentFilename, remoteRoot) => {
    const filename = path_1.join(remoteRoot, deploymentFilename);
    return driver.createFile(filename, JSON.stringify(deploymentFile));
};
