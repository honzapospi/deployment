import fs from 'fs-extra';
import {join} from 'path';
import log from "./logger";
import listDir from './listDir';
import isFileIgnored from './isFileIgnored';
import {dot, info} from "./output";
import normalizePath from './normalizePath';

const FILE = 'file';
const DIR = 'dir';

export default (dir: string, localRoot: string, ignore: string[]): Promise<FileMeta[]> => {
    return new Promise((resolve, reject) => {
        getDirMeta('/', dir, localRoot).then(dirMeta => {
            const newList : FileMeta[] = [];
            addFilesToList(newList, dirMeta, ignore);
            resolve(newList);
        }).catch(reject);
    });
}

const addFilesToList = (list: FileMeta[], dir: FileMeta, ignore: string[]): void => {
    if(dir.files){
        dir.files.forEach(file => {
            if(isFileIgnored(file.name, ignore)){
                info('Ignoring '+file.name);
                return;
            }
            if(file.type === FILE){
                list.push(file);
            } else if(file.type === DIR) {
                list.push(file);
                addFilesToList(list, file, ignore);
            } else {
                throw new Error('Invalid type');
            }
        })
    }
}

const getFileMeta = (name: string): Promise<FileMeta> => {
    return new Promise((resolve, reject) => {
        resolve({
            name: normalizePath(name),
            type: FILE
        });
    });
}

const getDirMeta = (name: string, dir: string, localRoot: string): Promise<FileMeta> => {
    return new Promise((resolve, reject) => {
        const dirname: string = join(dir, localRoot, name);
        const ret: FileMeta = {
            name: normalizePath(name),
            type: DIR
        };
        listDir(dirname).then(filelist => {
            const newList: Promise<FileMeta>[] = [];
            filelist.forEach(file => {
                const filename = join(dirname, file.name);
                const meta = fs.lstatSync(filename);
                if(meta.isDirectory()){
                    newList.push(getDirMeta(join(name, file.name), dir, localRoot));
                } else if(meta.isFile()) {
                    newList.push(getFileMeta(join(name, file.name)));
                } else {
                    // only files and directories are uploaded
                    // @see: https://nodejs.org/api/fs.html#fs_class_fs_stats for other file types
                }
            });
            Promise.all(newList).then(result => {
                ret.files = result;
                resolve(ret);
            }).catch(reject);
        }).catch(reject)

    });
}