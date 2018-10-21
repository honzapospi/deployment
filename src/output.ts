let addNewLineChar = false;

export const processStart = (msg: string) => {
    addNewLineChar = true;
    process.stdout.write("\n"+msg);
}

export const processError = (msg: string) => {
    addNewLineChar = true;
    process.stdout.write('...FAILED '+msg);
}

export const processSuccess = () => {
    addNewLineChar = true;
    process.stdout.write('...OK');
}

export const error =  (msg: string) => {
    addNewLineChar = true;
    process.stdout.write("\nERROR: "+msg);
}

export const fatal =  (msg: string) => {
    //console.log('\x1b[31m%s\x1b[0m', "FATAL ERROR: "+msg);
    const starter = addNewLineChar ? "\n" : '';
    addNewLineChar = false;
    console.log(starter +"FATAL ERROR: "+msg);
    process.exit();
}

export const warning = (msg: string) => {
    //console.log('\x1b[35m%s\x1b[0m', "WARNING: "+msg);
    const starter = addNewLineChar ? "\n" : '';
    addNewLineChar = false;
    console.log(starter+"WARNING: "+msg);
}

export const info = (msg: string) => {
    const starter = addNewLineChar ? "\n" : '';
    addNewLineChar = true;
    process.stdout.write(starter + msg);
}

export const printLine = (msg: string = '') => {
    const starter = addNewLineChar ? "\n" : '';
    addNewLineChar = true;
    process.stdout.write(starter+msg);
}

export const dot = () => {
    addNewLineChar = true;
    process.stdout.write('.');
}