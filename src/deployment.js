const tracer = require('./tracer');

module.exports = (cfg) => {
    let config = require('./create_configuration')(cfg);
    let pcg = require('../package.json');
    let appRoot = pcg._where;
    run(config, appRoot);
}

function run(config, appRoot){
    if(require('./validate_config')(config)){
        // create deployment service depend of configuration
        const deployment = require('./create_deployment')(config);
        // connect
        require('./connect')(deployment).then(() => {
            // fix local root
            if(config.localRoot.slice(-1) == '/')
                config.localRoot = config.localRoot.substr(0, config.localRoot.length - 1);
            // get deployment file
            require('./remote/get_deployment_file')(config.remoteRoot+config.deploymentFile, deployment).then(deployedFiles => {
                // create lists
                tracer.processStart('Creating deployment list of files.', true);
                require('./create_lists')(appRoot + config.localRoot, deployedFiles, config.ignore).then((lists) => {
                    // upload files from local list
                    process.stdout.write("\n"+'Uploading files...');
                    require('./remote/upload')(lists.localList, lists.remoteList, deployment, appRoot + config.localRoot, config.remoteRoot).then(uploaded => {
                        // lists.remoteList should be + localList now
                        process.stdout.write("\n"+'Renaming files...');
                        // rename uploaded files
                        require('./remote/rename')(uploaded, config.remoteRoot, deployment).then(() => {
                            // delete files
                            tracer.printLine('Removing files...');
                            require('./remote/delete')(lists.toRemove, config.remoteRoot, deployment).then(() => {
                                // deploy deployment file
                                require('./remote/create_deployment_file')(lists.remoteList, config.remoteRoot+config.deploymentFile, deployment).then(() => {
                                    // purge
                                    tracer.printLine('Purge...');
                                    require('./remote/purge')(config.purge, deployment, config.remoteRoot).then(() => {
                                        tracer.printLine('Deployment done.'+"\n");
                                        deployment.close();
                                    });
                                });
                            });
                        });
                    });
                });
            });
        })
    }
}





