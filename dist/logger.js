"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (msg, type = 'info') => {
    var file = '';
    var o = new Error();
    o.stack.split("\n").forEach((line, i) => {
        if (i == 2) {
            var parts = line.split('(');
            var str = parts[parts.length - 1];
            file = str.substring(0, str.length - 1);
        }
    });
    console.log('\x1b[36m%s\x1b[0m', 'LOG:' + type + ' (' + typeof msg + ') at: ' + file);
    console.log(msg);
};
