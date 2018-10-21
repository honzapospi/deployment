import fs from 'fs-extra';
import log from '../../logger';
import {FILE_IS_DIRECTORY, NOT_SUCH_FILE_OR_DIRECTORY, PERMISSION_DENIED} from '../errors';
import list from './list';
import validateConfig from './validateConfig';


const getFileContent = (filename: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, 'utf-8', (err, data) => {
            if(err){
                if(err.code === 'ENOENT'){
                    const e: Err = {
                        code: NOT_SUCH_FILE_OR_DIRECTORY,
                        path: err.path,
                        error: err
                    };
                    reject(e);
                } else {
                    log(err);
                    reject(err);
                }
            }
            else
                resolve(data);
        })
    })
}

const uploadFile = (localFilename: string, remoteFilename: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        fs.copy(localFilename, remoteFilename, (err) => {
            if(err)
                reject(err);
            else
                resolve(true);
        });
    });
}

const mkdir = (dir: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        fs.mkdirs(dir, (err) => {
            if(err)
                reject(err);
            else
                resolve(true);
        })
    });
}

const rename = (from: string, to: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        fs.rename(from, to, (err) => {
            if(err)
                reject(err);
            else
                resolve(true);
        });
    });
}

const remove = (filename: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        if(fs.existsSync(filename)){
            fs.unlink(filename, (err) => {
                if(err){
                    if(err.code === 'EISDIR'){
                        const e: Err = {
                            code: FILE_IS_DIRECTORY,
                            path: err.path,
                            error: err
                        }
                        reject(e);
                    } else if(err.code === 'EACCES'){ // permission denied on file
                        const e: Err = {
                            code: PERMISSION_DENIED,
                            path: err.path,
                            error: err
                        }
                        reject(e);
                    } else if(err.code === 'EPERM'){ // permission denied on dir
                        const e: Err = {
                            code: PERMISSION_DENIED,
                            path: err.path,
                            error: err
                        }
                        reject(e);
                    } else {
                        reject(err);
                    }
                }

                else
                    resolve(true);
            });
        } else {
            resolve(true);
        }
    });
}

const rmdir = (dir: string): Promise<boolean> => {
    return new Promise((result, reject) => {
        fs.remove(dir, (err) => {
            if(err)
                reject(err); // TODO check permission denied
            else
                result(true);
        });
    })
}

const createFile = (filename: string, contents: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        fs.writeFile(filename, contents, 'utf8', (err) => {
            if(err)
                reject(err);
            else
                resolve(true);
        })
    });
}

const connect = ():Promise<boolean> => {
    return new Promise((resolve, reject) => {
        resolve(true);
    });
}

export default {
    getFileContent,
    uploadFile,
    mkdir,
    rename,
    remove,
    rmdir,
    createFile,
    connect,
    list,
    validateConfig
};

