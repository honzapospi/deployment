let message = '';

module.exports = {
    processStart: function(msg){
        process.stdout.write("\n"+msg);
    },
    processError: function (msg) {
        process.stdout.write('...FAILED '+msg);
    },
    processSuccess: function () {
        process.stdout.write('...OK');
    },
    error: function (msg) {
        process.stdout.write("\nERROR: "+msg);
    },
    warning: function (msg) {
        process.stdout.write("\nWARNING: "+msg);
    },
    info: function (msg) {
        process.stdout.write("\nINFO: "+msg);
    },
    printLine: function (msg, newLine = true) {
        if(newLine)
            process.stdout.write("\n"+msg);
        else
            process.stdout.write(msg);
    }
}