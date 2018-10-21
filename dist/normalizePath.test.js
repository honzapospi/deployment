"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const normalizePath_1 = __importDefault(require("./normalizePath"));
describe('Test of normalizePath function', () => {
    it('Windows directory separator.', () => {
        expect(normalizePath_1.default('\\aaa\\bbb\\ccc')).toBe('/aaa/bbb/ccc');
    });
});
