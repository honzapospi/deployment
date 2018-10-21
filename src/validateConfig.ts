import {fatal} from './output';

export default (config: Config):void => {
    if(typeof config.driver !== 'string'){
        fatal('config.type must be string.');
    }
    const drivers = ['local'];
    if(drivers.indexOf(config.driver) === -1){
        fatal('config.driver must be one of: '+drivers.join(', '));
    }
    if(typeof config.localRoot !== 'string'){
        fatal('config.localRoot is required and must be string.');
    }
    if(typeof config.remoteRoot !== 'string'){
        fatal('config.remoteRoot is required and must be string.');
    }
    if(config.deploymentFile){
        if(typeof config.deploymentFile !== 'string'){
            fatal('config.deploymentFile must be relative path to deployment file.');
        }
    } else {
        config.deploymentFile = '/.deployment.js';
    }
    if(config.purge){
        if(!Array.isArray(config.purge)){
            fatal('config.purge must be array of destinations to be purged.');
        }
        config.purge.forEach(prg => {
            if(typeof prg !== 'string'){
                fatal('config.purge must be array of destinations to be purged.');
            }
        })

    } else {
        config.purge = [];
    }
    if(config.ignore){
        if(!Array.isArray(config.ignore)){
            fatal('config.ignore must be array of destinations to be ignore.');
        }
        config.purge.forEach(prg => {
            if(typeof prg !== 'string'){
                fatal('config.ignore must be array of destinations to be ignore.');
            }
        })
    } else {
        config.ignore = [];
    }
}