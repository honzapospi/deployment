type DeploymentData = {
    md5?: string,
    type: 'file' | 'dir'
}

type DeploymentFile = {
    [path: string] : DeploymentData
}

type FileMeta = {
    name: string,
    md5?: string,
    dir?: string,
    localRoot?: string,
    type?: 'file' | 'dir',
    files?: FileMeta[]
}

type Err = {
    code: string,
    path?: string,
    error: Error
}

type Config = {
    driver: 'local' | 'ftp'
    localRoot: string,
    remoteRoot: string,
    deploymentFile: string,
    ignore: string[],
    purge: string[]
}