"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const createList_1 = __importDefault(require("./createList"));
const path_1 = require("path");
const md5Dir_1 = __importDefault(require("./md5Dir"));
const getRemoteDeploymentFile_1 = __importDefault(require("./getRemoteDeploymentFile"));
const checkFiles_1 = __importDefault(require("./checkFiles"));
const fs_1 = __importDefault(require("fs"));
const uploadFiles_1 = __importDefault(require("./uploadFiles"));
const renameUploadedFiles_1 = __importDefault(require("./renameUploadedFiles"));
const removeFiles_1 = __importDefault(require("./removeFiles"));
const saveDeploymentFile_1 = __importDefault(require("./saveDeploymentFile"));
const output_1 = require("./output");
const purgeFiles_1 = __importDefault(require("./purgeFiles"));
const validateConfig_1 = __importDefault(require("./validateConfig"));
const createDriver_1 = __importDefault(require("./createDriver"));
exports.default = (config, dir) => __awaiter(this, void 0, void 0, function* () {
    validateConfig_1.default(config);
    const driver = createDriver_1.default(config);
    driver.validateConfig(config);
    // start stopwatch
    const startProcess = new Date().getTime();
    // check if localRoot directory exist
    const meta = fs_1.default.lstatSync(path_1.join(dir, config.localRoot));
    if (!meta.isDirectory()) {
        output_1.fatal('Directory "' + path_1.join(dir, config.localRoot + '" does not exist.'));
    }
    try {
        // connect to remote server
        output_1.processStart('Connecting to server.');
        yield driver.connect();
        output_1.processSuccess();
        // get list of files to be upload
        output_1.processStart('Scanning files in ' + path_1.join(dir, config.localRoot));
        const fileList = yield createList_1.default(dir, config.localRoot, config.ignore);
        // get remote list of md5 files
        const fileListWithMd5 = yield md5Dir_1.default(fileList, dir, config.localRoot);
        output_1.processSuccess();
        output_1.processStart('Fetching deployment list of files.');
        // get deployment file from remote
        const remoteDeploymentFile = yield getRemoteDeploymentFile_1.default(driver, path_1.join(config.remoteRoot, config.deploymentFile));
        output_1.processSuccess();
        // compare md5 files if is same or not
        const filesResult = checkFiles_1.default(fileListWithMd5, remoteDeploymentFile);
        output_1.processStart('Starting up uploading files.');
        // upload files
        yield uploadFiles_1.default(driver, filesResult.toUpload, dir, config.localRoot, config.remoteRoot);
        output_1.processStart('Starting up renaming files.');
        // rename files on remote
        yield renameUploadedFiles_1.default(driver, filesResult.toUpload, config.remoteRoot);
        // remove files
        output_1.processStart('Removing deleted files.');
        yield removeFiles_1.default(driver, filesResult.toRemove, config.remoteRoot);
        // save new created deployment file to remote
        output_1.processStart('Saving deployment file.');
        yield saveDeploymentFile_1.default(driver, filesResult.remoteDeploymentFile, config.deploymentFile, config.remoteRoot);
        output_1.processSuccess();
        // purge files
        if (config.purge.length > 0) {
            output_1.processStart('Purging files.');
            yield purgeFiles_1.default(driver, config.purge, config.remoteRoot);
        }
        // print duration
        const duration = Math.ceil(new Date().getTime() - startProcess) / 1000;
        output_1.info('Deployment done in ' + duration + ' seconds.');
        output_1.printLine();
    }
    catch (e) {
        output_1.processError(e.message);
    }
});
