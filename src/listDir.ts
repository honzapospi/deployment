import fs from 'fs';

export default (dir: string):Promise<FileMeta[]> => {
    return new Promise((resolve, reject) => {
        fs.readdir(dir, (err, list) => {
            if(err){
                reject(err);
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