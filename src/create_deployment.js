module.exports = function(config){
    if(config.type == 'ssh2'){
        return require('./driver/ssh2')(config.connect);
    } else if(config.type == 'local'){
        return require('./driver/local')();
    }
    else {
        console.log('Unsupported type '+config.type);
    }
}