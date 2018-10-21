import {NOT_SUCH_FILE_OR_DIRECTORY} from "./driver/errors";

export default (driver: IDriver, file: string): Promise<DeploymentFile> => {
    return new Promise((resolve, reject) => {
        driver.getFileContent(file).then(content => {
            resolve(JSON.parse(content));
        }).catch(error => {
            if(error.code === NOT_SUCH_FILE_OR_DIRECTORY){
                resolve({});
            } else {
                reject(error);
            }
        })
    });
}