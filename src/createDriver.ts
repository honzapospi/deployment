import local from './driver/local';

export default (config: Config) => {
    if(config.driver === 'local'){
        return local;
    } else {
        throw new Error('Driver "'+config.driver+'" does not exist.');
    }
}