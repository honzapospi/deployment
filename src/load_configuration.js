module.exports = () => {
    let config = require('../config');
    if(!config.purge)
        config.purge = [];
    if(!config.deploymentFile)
        config.deploymentFile = '/.deployment.js';
    if(!config.ignore)
        config.ignore = [];
    if(config.type == 'ssh2'){
        if(config.connect && !config.connect.port)
            config.connect.port = 22;
    }
    return config;
}