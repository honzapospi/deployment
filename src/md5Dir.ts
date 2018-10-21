import {join} from 'path';
import md5 from 'md5';
import {readFile} from 'fs';
import {dot} from "./output";

let counter = 0;

const readFileDeep = (file: FileMeta, filename: string, resolve: (any), reject: (any), curr: number, limit: number) => {
    if(curr === limit){
        reject(new Error('Read file failed '+limit+'times: '+filename));
    }
    readFile(filename, (err, buf) => {
        if(err){
            if(curr > 10){
                setTimeout(() => {
                    readFileDeep(file, filename, resolve, reject, curr + 1, limit);    
                }, 10 * curr);
            } else {
                readFileDeep(file, filename, resolve, reject, curr + 1, limit);
            }
        }
        else {
            file.md5 = md5(buf);
            if(counter % 100 === 0)
                dot();
            counter++;
            resolve(file);
        }
    });
}

export default (fileList: FileMeta[], dir: string, localRoot: string): Promise<FileMeta[]> => {
    const newList: Promise<FileMeta>[] = [];
    fileList.forEach(file => {
        newList.push(new Promise((resolve, reject) => {
            const filename: string = join(dir, localRoot, file.name);
            if(file.type === 'file'){
                readFileDeep(file, filename, resolve, reject, 1, 100);
            } else if(file.type === 'dir') {
                resolve(file);
            } else {
                reject(new Error('Unknow filetype of '+filename));
            }
        }))
    })
    return new Promise((resolve, reject) => {
        Promise.all(newList).then(resolve).catch(reject);
    });
}