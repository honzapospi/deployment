"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const isFileIgnored_1 = __importDefault(require("./isFileIgnored"));
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
        expect(isFileIgnored_1.default('/my/dir/in', ignore)).toBe(true);
        expect(isFileIgnored_1.default('/my/dir/in', ignore2)).toBe(true);
    });
    it('Test dir name in any deep', () => {
        const ignore = [
            '/my/dir/in',
            'anydir'
        ];
        const ignore2 = [
            '/my/dir/in/',
            'anydir'
        ];
        expect(isFileIgnored_1.default('/xxx/anydir/in', ignore)).toBe(true);
        expect(isFileIgnored_1.default('/xxx/anyd/in', ignore2)).toBe(false);
    });
    it('Test any file in directory', () => {
        const ignore = [
            '/temp/*'
        ];
        expect(isFileIgnored_1.default('/temp/test.txt', ignore)).toBe(true);
        expect(isFileIgnored_1.default('/temp', ignore)).toBe(false);
    });
});
