interface IDriver {
    getFileContent: (filename: string) => Promise<string>
    uploadFile: (localFilename: string, remoteFilename: string) => Promise<boolean>
    mkdir: (dir: string) => Promise<boolean>
    rename: (from: string, to: string) => Promise<boolean>
    remove: (filename: string) => Promise<boolean>
    rmdir: (dir: string) => Promise<boolean>
    createFile: (filename: string, contents: string) => Promise<boolean>
    connect: () => Promise<boolean>
    list: (dir: string) => Promise<FileMeta[]>
    validateConfig: (config: Config) => void;
}
