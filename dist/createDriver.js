"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const local_1 = __importDefault(require("./driver/local"));
exports.default = (config) => {
    if (config.driver === 'local') {
        return local_1.default;
    }
    else {
        throw new Error('Driver "' + config.driver + '" does not exist.');
    }
};
