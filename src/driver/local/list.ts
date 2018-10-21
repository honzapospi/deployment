import {NOT_SUCH_FILE_OR_DIRECTORY} from "../errors";
import fs from 'fs-extra';
import normalizePath from '../../normalizePath';

export default (dir: string):Promise<FileMeta[]> => {
    return new Promise((resolve, reject) => {
        fs.readdir(dir, (err, list) => {
            if(err){
                if(err.code === 'ENOENT'){
                    const e: Err = {
                        code: NOT_SUCH_FILE_OR_DIRECTORY,
                        path: normalizePath(err.path ? err.path: ''),
                        error: err
                    };
                    reject(e);
                } else {
                    reject(err);
                }
            }
            else {
                const ret: FileMeta[] = list.map(name => {
                    return {name: name}
                });
                resolve(ret);
            }
        });
    });
}