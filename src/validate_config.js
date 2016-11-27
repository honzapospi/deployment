module.exports = function(config){
    let supportedTypes = ['ssh2', 'local'];
    try {
        if(supportedTypes.indexOf(config.type) == -1){
            throw new Error('Type "' + config.type + '" not supported.');
        }
        if(config.localRoot.charAt(0) != '/')
            throw new Error('localRoot must start with /');
        if(config.remoteRoot.charAt(0) != '/')
            throw new Error('remoteRoot must start with /');
        if(config.type == 'ssh2'){
            if(!config.connect){
                throw new Error('Missing required section "connect: {...}"');
            }
            if(!config.connect.host){
                throw new Error('Missing required parameter "connect.host"');
            }
            if(!config.connect.username){
                throw new Error('Missing required parameter "connect.username"');
            }
            if(!config.connect.password){
                throw new Error('Missing required parameter "connect.password"');
            }
        }

        console.log('Configuration file is valid.');
        return true;
    } catch (e){
        console.log('Error: '+e.message);
    }
}