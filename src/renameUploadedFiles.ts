import {join} from 'path';
import {info} from "./output";

let counter = 1;

export default (driver: IDriver, files: FileMeta[], remoteRoot: string) => {
    const filesOnly = files.filter(file => {
        return file.type === 'file';
    })
    const total = filesOnly.length;
    return new Promise((resolve, reject) => {
        const plist: Promise<boolean>[] = [];
        filesOnly.forEach(file => {
            const remoteFilename = join(remoteRoot, file.name);
            const renameFilePromise: Promise<boolean> = new Promise((res, rej) => {
                driver.rename(remoteFilename + '.deployment', remoteFilename).then(result => {
                    info('('+counter+' of '+total+') RENAMING '+file.name);
                    res(result);
                    counter++;
                }).catch(rej)
            });
            plist.push(renameFilePromise);
        })
        Promise.all(plist).then(resolve).catch(reject);
    });
}