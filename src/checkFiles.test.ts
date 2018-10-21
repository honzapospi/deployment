import checkFiles from './checkFiles';

describe('Test of checkFile function', () => {
    test('Same files with different md5', () => {
        const fileListWithMd5: FileMeta[] = [
            {
                name: '/some/nice/dir',
                type: 'dir'
            },
            {
                name: '/some/nice/file',
                type: 'file',
                md5: '1111'
            }
        ];
        const deploymentFile: DeploymentFile = {
            '/some/nice/dir': {
                type: 'dir'
            },
            '/some/nice/file': {
                type: 'file',
                md5: '1234'
            }
        };
        const result = checkFiles(fileListWithMd5, deploymentFile);
        expect(result).toEqual({
            remoteDeploymentFile: {
                "/some/nice/dir": {
                    type: "dir"
                },
                "/some/nice/file": {
                    md5: '1111',
                    type: 'file'
                }
            },
            toRemove: [],
            toUpload: [{
                name: '/some/nice/file',
                type: 'file',
                md5: '1111'
            }]
        });
    })

    test('Remove file', () => {
        const fileListWithMd5: FileMeta[] = [
            {
                name: '/some/nice/dir',
                type: 'dir'
            }
        ];
        const deploymentFile: DeploymentFile = {
            '/some/nice/dir': {
                type: 'dir'
            },
            '/some/nice/file': {
                type: 'file',
                md5: '1234'
            }
        };
        const result = checkFiles(fileListWithMd5, deploymentFile);
        expect(result).toEqual({
            remoteDeploymentFile: {
                "/some/nice/dir": {
                    type: "dir"
                }
            },
            toRemove: [{
                name: '/some/nice/file',
                type: 'file',
                md5: '1234'
            }],
            toUpload: []
        });
    })
});