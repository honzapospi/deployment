import isFileIgnored from './isFileIgnored';

describe('Test of cunction isFileIgnored', () => {
    it('Test absolute path', () => {
        const ignore = [
            '/my/dir/in',
            'anydir'
        ];
        const ignore2 = [
            '/my/dir/in/',
            'anydir'
        ];
        expect(isFileIgnored('/my/dir/in', ignore)).toBe(true);
        expect(isFileIgnored('/my/dir/in', ignore2)).toBe(true);
    })
    it('Test dir name in any deep', () => {
        const ignore = [
            '/my/dir/in',
            'anydir'
        ];
        const ignore2 = [
            '/my/dir/in/',
            'anydir'
        ];
        expect(isFileIgnored('/xxx/anydir/in', ignore)).toBe(true);
        expect(isFileIgnored('/xxx/anyd/in', ignore2)).toBe(false);
    })
    it('Test any file in directory', () => {
        const ignore = [
            '/temp/*'
        ];
        expect(isFileIgnored('/temp/test.txt', ignore)).toBe(true);
        expect(isFileIgnored('/temp', ignore)).toBe(false);
    })
})