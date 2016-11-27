const chai = require('chai');
const expect = chai.expect;
const fs = require('fs-extra');
const config = require('./local-config');
const deployment = require('../../src/create_deployment')(config);
const randomstring = require('randomstring');

const tempDir = __dirname+'/../temp';

describe('Local deployment:', () => {
    it('Method getFileContent() should return Promise.', () => {
        let result = deployment.getFileContent(__dirname+'/local-config.js');
        expect(result instanceof Promise).to.be.true;
        return result.then(data => {
            expect(data).to.be.a('string');
        });
    });
    it('Method uploadFile() should copy file to destination.', () => {
        let result = deployment.uploadFile(__dirname+'/local-config.js', tempDir+'/local-config.js');
        expect(result instanceof Promise).to.be.true;
        return result.then(() => {
            expect(fs.lstatSync(tempDir+'/local-config.js').isFile()).to.be.true;
        })
    })
    it('Method mkdir() should create a new directory.', () => {
        let newDirName = tempDir+'/'+randomstring.generate(10) + '/' + randomstring.generate(10);
        let result = deployment.mkdir(newDirName);
        expect(result instanceof Promise).to.be.true;
        return result.then(() => {
            expect(fs.lstatSync(newDirName).isDirectory()).to.be.true;
        })
    })
    it('Method rmdir() should remove a directory.', () => {
        // we need to create a dir firstly
        let dirToRemove = tempDir+'/'+randomstring.generate(10);
        let newDir = dirToRemove + '/subfolder';
        let result = deployment.mkdir(newDir);
        return result.then(() => {
            let result2 = deployment.rmdir(dirToRemove);
            return result2.then(() => {
                expect(fs.existsSync(dirToRemove)).to.be.false;
            });
        })
    })
    it('Method createFile should create file.', () => {
        let fileToCreate = tempDir+'/.deployment.js';
        let result = deployment.createFile(fileToCreate, '{}');
        expect(result instanceof Promise).to.be.true;
        return result.then(() => {
            expect(fs.lstatSync(fileToCreate).isFile()).to.be.true;
        });
    })
    it('Method rename should rename the file.', () => {
        let fileToRename = tempDir+'/'+randomstring.generate(10);
        let newName = tempDir+'/'+randomstring.generate(10);
        return deployment.createFile(fileToRename).then(() => {
            // file exist, lets rename
            result = deployment.rename(fileToRename, newName);
            expect(result instanceof Promise).to.be.true;
            return result.then(() => {
                expect(fs.lstatSync(newName).isFile()).to.be.true;
            });
        });

    })
    it('Method delete should delete the file.', () => {
        let fileToRemove = tempDir+'/'+randomstring.generate(10);
        return deployment.createFile(fileToRemove).then(() => {
            // file exist, lets delete
            result = deployment.delete(fileToRemove);
            expect(result instanceof Promise).to.be.true;
            return result.then(() => {
                expect(fs.existsSync(fileToRemove)).to.be.false;
            });
        });
    })
    it('Method list should return list of object with name parameter.', () => {
        let result = deployment.list(__dirname);
        expect(result instanceof Promise).to.be.true;
        return result.then( (list) => {
            expect(list).to.be.object;
        });
    })
});

