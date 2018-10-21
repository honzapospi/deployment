import {join} from 'path';
import {FILE_IS_DIRECTORY, NOT_SUCH_FILE_OR_DIRECTORY, PERMISSION_DENIED} from "./driver/errors";
import {info, warning, error as logError} from "./output";

export default (driver: IDriver, purge: string[], remoteRoot: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        const plist: Promise<FileMeta[]>[] = [];
        purge.forEach(path => {
            const dir = join(remoteRoot, path);
            const dirPromise:Promise<FileMeta[]> = new Promise((res, rej) => {
                driver.list(dir).then(result => {
                    info('Purging directory '+dir);
                    const result2 = result.map(file => {
                        return {name: join(dir, file.name)};
                    });
                    res(result2);
                }).catch(error => {
                    if(error.code == NOT_SUCH_FILE_OR_DIRECTORY){
                        warning('Unable to purge directory "'+path+'". Directory not exist.');
                        res([]);
                    } else {
                        rej(error);
                    }
                })
            });
            plist.push(dirPromise);
        })
        const plist2: Promise<boolean>[] = [];
        Promise.all(plist).then(filelist => {
            filelist.forEach(dirList=> {
                dirList.forEach(file => {
                    plist2.push(removeFile(driver, file.name))
                })
            })
            Promise.all(plist2).then(result => {
                resolve(true);
            }).catch(reject);
        }).catch(reject);
    });
}

const removeFile = (driver: IDriver, name: string):Promise<boolean> => {
    return new Promise((resolve, reject) => {
        driver.remove(name).then(result => {
            resolve(true);
        }).catch(error => {
            if(error.code === FILE_IS_DIRECTORY){
                driver.rmdir(name).then(result => {
                    resolve(true);
                }).catch(reject);
            } else if(error.code === PERMISSION_DENIED){
                logError('Unable to purge directory "'+name+'". Permission denied.');
                resolve(true);
            } else {
                reject(error);
            }
        })
    });
}