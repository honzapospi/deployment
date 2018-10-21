"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const list_1 = __importDefault(require("./list"));
const errors_1 = require("../errors");
describe('Test list of files', () => {
    it('Destination not exist.', () => {
        expect.assertions(2);
        return list_1.default('/not/exist').catch(error => {
            console.log('************************ERR');
            expect(error.code).toBe(errors_1.NOT_SUCH_FILE_OR_DIRECTORY);
            const epath = process.platform === "win32" ? error.path.substr(2) : error.path;
            expect(epath).toBe('/not/exist');
        });
    });
});
