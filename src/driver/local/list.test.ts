import list from './list';
import {NOT_SUCH_FILE_OR_DIRECTORY} from '../errors';

describe('Test list of files', () => {
    it('Destination not exist.', () => {
        expect.assertions(2);
        return list('/not/exist').catch(error => {
            console.log('************************ERR');
            expect(error.code).toBe(NOT_SUCH_FILE_OR_DIRECTORY);
            const epath = process.platform === "win32" ? error.path.substr(2) : error.path;
            expect(epath).toBe('/not/exist');
        });
    })
})
