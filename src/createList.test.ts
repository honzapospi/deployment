import createList from './createList';

const appDir = __dirname;
const localDir = '../test';

const dirResult = [
    {
        "name": "/test_data",
        "type": "dir",
        "files": [
            {
                "name": "/test_data/dir1",
                "type": "dir",
                "files": [
                    {
                        "name": "/test_data/dir1/file3.txt",
                        "type": "file"
                    },
                    {
                        "name": "/test_data/dir1/log",
                        "type": "dir",
                        "files": [
                            {
                                "name": "/test_data/dir1/log/logfile.log",
                                "type": "file"
                            }
                        ]
                    }
                ]
            },
            {
                "name": "/test_data/file1.txt",
                "type": "file"
            },
            {
                "name": "/test_data/file2.txt",
                "type": "file"
            },
            {
                "name": "/test_data/log",
                "type": "dir",
                "files": [
                    {
                        "name": "/test_data/log/logfile.txt",
                        "type": "file"
                    }
                ]
            }
        ]
    },
    {
        "name": "/test_data/dir1",
        "type": "dir",
        "files": [
            {
                "name": "/test_data/dir1/file3.txt",
                "type": "file"
            },
            {
                "name": "/test_data/dir1/log",
                "type": "dir",
                "files": [
                    {
                        "name": "/test_data/dir1/log/logfile.log",
                        "type": "file"
                    }
                ]
            }
        ]
    },
    {
        "name": "/test_data/dir1/file3.txt",
        "type": "file"
    },
    {
        "name": "/test_data/dir1/log",
        "type": "dir",
        "files": [
            {
                "name": "/test_data/dir1/log/logfile.log",
                "type": "file"
            }
        ]
    },
    {
        "name": "/test_data/dir1/log/logfile.log",
        "type": "file"
    },
    {
        "name": "/test_data/file1.txt",
        "type": "file"
    },
    {
        "name": "/test_data/file2.txt",
        "type": "file"
    },
    {
        "name": "/test_data/log",
        "type": "dir",
        "files": [
            {
                "name": "/test_data/log/logfile.txt",
                "type": "file"
            }
        ]
    },
    {
        "name": "/test_data/log/logfile.txt",
        "type": "file"
    }
]

describe('Testing function createList.', () => {
    it('Get full list of files.', () => {
        expect.assertions(1);
        return createList(appDir, localDir, []).then(result => {
            expect(result).toEqual(dirResult);
        })
    });
});


