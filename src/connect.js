const tracer = require('./tracer');

module.exports = function (deployment) {
    return new Promise((resolve, reject) => {
        tracer.processStart('Connecting to remote host...', true)
        deployment.connect().then(() => {
            tracer.processSuccess(true);
            resolve();
        }).catch(e => {
            tracer.processError('Unable to connect. ERROR: '+e.message+"\n")
        })
    })
}