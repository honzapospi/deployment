"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let addNewLineChar = false;
exports.processStart = (msg) => {
    addNewLineChar = true;
    process.stdout.write("\n" + msg);
};
exports.processError = (msg) => {
    addNewLineChar = true;
    process.stdout.write('...FAILED ' + msg);
};
exports.processSuccess = () => {
    addNewLineChar = true;
    process.stdout.write('...OK');
};
exports.error = (msg) => {
    addNewLineChar = true;
    process.stdout.write("\nERROR: " + msg);
};
exports.fatal = (msg) => {
    //console.log('\x1b[31m%s\x1b[0m', "FATAL ERROR: "+msg);
    const starter = addNewLineChar ? "\n" : '';
    addNewLineChar = false;
    console.log(starter + "FATAL ERROR: " + msg);
    process.exit();
};
exports.warning = (msg) => {
    //console.log('\x1b[35m%s\x1b[0m', "WARNING: "+msg);
    const starter = addNewLineChar ? "\n" : '';
    addNewLineChar = false;
    console.log(starter + "WARNING: " + msg);
};
exports.info = (msg) => {
    const starter = addNewLineChar ? "\n" : '';
    addNewLineChar = true;
    process.stdout.write(starter + msg);
};
exports.printLine = (msg = '') => {
    const starter = addNewLineChar ? "\n" : '';
    addNewLineChar = true;
    process.stdout.write(starter + msg);
};
exports.dot = () => {
    addNewLineChar = true;
    process.stdout.write('.');
};
