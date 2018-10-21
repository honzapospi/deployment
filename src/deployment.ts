import createList from './createList';
import {join} from 'path';
import md5Dir from './md5Dir';
import getRemoteDeploymentFile from './getRemoteDeploymentFile';
import checkFiles from './checkFiles';
import fs from 'fs';
import uploadFiles from './uploadFiles';
import renameUploadedFiles from './renameUploadedFiles';
import removeFiles from './removeFiles';
import saveDeploymentFile from './saveDeploymentFile';
import {fatal, processStart, processError, processSuccess, info, printLine, warning} from './output';
import purgeFiles from "./purgeFiles";
import validateConfig from "./validateConfig";
import createDriver from './createDriver';

export default async (config: Config, dir: string) => {
    validateConfig(config);
    const driver = createDriver(config);
    driver.validateConfig(config);

    // start stopwatch
    const startProcess: number = new Date().getTime();

    // check if localRoot directory exist
    const meta = fs.lstatSync(join(dir, config.localRoot));
    if (!meta.isDirectory()) {
        fatal('Directory "' + join(dir, config.localRoot + '" does not exist.'));
    }
    try {
        // connect to remote server
        processStart('Connecting to server.')
        await driver.connect();
        processSuccess();

        // get list of files to be upload
        processStart('Scanning files in ' + join(dir, config.localRoot));
        const fileList = await createList(dir, config.localRoot, config.ignore);
        // get remote list of md5 files
        const fileListWithMd5 = await md5Dir(fileList, dir, config.localRoot);
        processSuccess();

        processStart('Fetching deployment list of files.');
        // get deployment file from remote
        const remoteDeploymentFile = await getRemoteDeploymentFile(driver, join(config.remoteRoot, config.deploymentFile));
        processSuccess();

        // compare md5 files if is same or not
        const filesResult = checkFiles(fileListWithMd5, remoteDeploymentFile);

        processStart('Starting up uploading files.')
        // upload files
        await uploadFiles(driver, filesResult.toUpload, dir, config.localRoot, config.remoteRoot);

        processStart('Starting up renaming files.')
        // rename files on remote
        await renameUploadedFiles(driver, filesResult.toUpload, config.remoteRoot);

        // remove files
        processStart('Removing deleted files.')
        await removeFiles(driver, filesResult.toRemove, config.remoteRoot);

        // save new created deployment file to remote
        processStart('Saving deployment file.')
        await saveDeploymentFile(driver, filesResult.remoteDeploymentFile, config.deploymentFile, config.remoteRoot);
        processSuccess();

        // purge files
        if(config.purge.length > 0){
            processStart('Purging files.');
            await purgeFiles(driver, config.purge, config.remoteRoot);
        }

        // print duration
        const duration = Math.ceil(new Date().getTime() - startProcess) / 1000;
        info('Deployment done in '+duration+' seconds.');
        printLine();
    } catch (e) {
        processError(e.message);
    }
}