import {join} from 'path';
import {info} from "./output";

let counter = 1;

export default (driver: IDriver, files: FileMeta[], remoteRoot: string) => {
    const total = files.length;
    return new Promise((resolve, reject) => {
        const plist: Promise<boolean>[] = [];
        files.forEach(file => {
            const filename = join(remoteRoot, file.name);
            if(file.type === 'file'){
                const removeFilePromise: Promise<boolean> = new Promise((res, rej) => {
                    driver.remove(filename).then(result => {
                        info('('+counter+' of '+total+') REMOVING '+file.name);
                        res(result);
                    }).catch(rej);
                });
                plist.push(removeFilePromise);
            } else if(file.type === 'dir'){
                const removeDirPromise: Promise<boolean> = new Promise((res, rej) => {
                    driver.rmdir(filename).then(result => {
                        info('('+counter+' of '+total+') REMOVING '+file.name);
                        res(result);
                    }).catch(rej);
                });
                plist.push(removeDirPromise);
            }
        })
        Promise.all(plist).then(resolve).catch(reject);
    });
}