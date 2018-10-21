const list = (dir: string):Promise<FileMeta[]> => {
    return new Promise((resolve, reject) => {
        resolve([
            {name: 'file1.txt'},
            {name: 'file2.txt'},
            {name: 'dir'}
        ]);
    });
}

const getFileContent = (filename: string): Promise<string> => {
    return new Promise((resolve, reject) => {

    });
}

const uploadFile = (localFilename: string, remoteFilename: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {

    });
}

const mkdir = (dir: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {

    });
}

const rename = (from: string, to: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {

    });
}

const remove = (filename: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {

    });
}

const rmdir = (dir: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {

    });
}

export default {
    list,
    getFileContent,
    uploadFile,
    mkdir,
    rename,
    remove,
    rmdir
}