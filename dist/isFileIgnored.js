"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (name, ignore) => {
    for (let i = 0; i < ignore.length; i++) {
        let toIgnore = ignore[i];
        // absolute path, e.g.: /temp
        if (toIgnore.substring(0, 1) === '/') { // start with "/" char
            if (toIgnore.substring(toIgnore.length - 1) === '/') { // end with "/" char
                toIgnore = toIgnore.substring(0, toIgnore.length - 1);
            }
            else if (toIgnore.substring(toIgnore.length - 2) === '/*') { // ignore all files in dir
                toIgnore = toIgnore.substring(0, toIgnore.length - 1);
                if (toIgnore === name) // not ignore dir
                    return false;
                else if (toIgnore === name.substr(0, toIgnore.length)) {
                    return true;
                }
            }
            if (name === toIgnore)
                return true;
        }
        // dir or file, e.g: log
        if (toIgnore.substring(0, 1) !== '/') {
            const parts = name.split('/');
            if (parts.indexOf(toIgnore) !== -1) {
                return true;
            }
        }
    }
    return false;
};
