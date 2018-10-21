"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const output_1 = require("./output");
exports.default = (config) => {
    if (typeof config.driver !== 'string') {
        output_1.fatal('config.type must be string.');
    }
    const drivers = ['local'];
    if (drivers.indexOf(config.driver) === -1) {
        output_1.fatal('config.driver must be one of: ' + drivers.join(', '));
    }
    if (typeof config.localRoot !== 'string') {
        output_1.fatal('config.localRoot is required and must be string.');
    }
    if (typeof config.remoteRoot !== 'string') {
        output_1.fatal('config.remoteRoot is required and must be string.');
    }
    if (config.deploymentFile) {
        if (typeof config.deploymentFile !== 'string') {
            output_1.fatal('config.deploymentFile must be relative path to deployment file.');
        }
    }
    else {
        config.deploymentFile = '/.deployment.js';
    }
    if (config.purge) {
        if (!Array.isArray(config.purge)) {
            output_1.fatal('config.purge must be array of destinations to be purged.');
        }
        config.purge.forEach(prg => {
            if (typeof prg !== 'string') {
                output_1.fatal('config.purge must be array of destinations to be purged.');
            }
        });
    }
    else {
        config.purge = [];
    }
    if (config.ignore) {
        if (!Array.isArray(config.ignore)) {
            output_1.fatal('config.ignore must be array of destinations to be ignore.');
        }
        config.purge.forEach(prg => {
            if (typeof prg !== 'string') {
                output_1.fatal('config.ignore must be array of destinations to be ignore.');
            }
        });
    }
    else {
        config.ignore = [];
    }
};
