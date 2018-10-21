import {join} from 'path';
import {info} from "./output";

let counter = 1;

export default (driver: IDriver, files: FileMeta[], dir: string, localRoot: string, remoteRoot: string) => {
    const total = files.length;
    return new Promise((resolve, reject) => {
        const plist: Promise<boolean>[] = [];
        files.forEach(file => {
            const localFilename = join(dir, localRoot, file.name);
            const remoteFilename = join(remoteRoot, file.name);
            if(file.type === 'file'){
                const uploadPromise: Promise<boolean> = new Promise((res, rej) => {
                    driver.uploadFile(localFilename, remoteFilename + '.deployment').then(result => {
                        info('('+ counter +' of '+total+') UPLOADING '+file.name);
                        counter++;
                        res(result);
                    }).catch(rej);
                });
                plist.push(uploadPromise);
            } else if (file.type === 'dir') {
                const uploadPromise: Promise<boolean> = new Promise((res, rej) => {
                    driver.mkdir(remoteFilename).then(result => {
                        info('('+ counter +' of '+total+') UPLOADING '+file.name);
                        counter++;
                        res(result);
                    }).catch(rej);
                });
                plist.push(uploadPromise);
            }
        })
        Promise.all(plist).then(resolve).catch(reject);
    });


}