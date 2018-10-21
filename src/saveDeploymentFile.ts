import {join} from 'path';
import fs from 'fs';

export default (driver: IDriver, deploymentFile: DeploymentFile, deploymentFilename: string, remoteRoot: string):Promise<boolean> => {
    const filename = join(remoteRoot, deploymentFilename);
    return driver.createFile(filename, JSON.stringify(deploymentFile));
}