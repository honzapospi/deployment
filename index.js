module.exports = (cfg) => {
    let config = require('./src/create_configuration')(cfg);
    let pcg = require('./package.json');
    let appRoot = pcg._where;
    run(config, appRoot);
}


function run(config, appRoot){
    if(require('./src/validate_config')(config)){
        // create deployment service depend of configuration
        const deployment = require('./src/create_deployment')(config);
        // connect
        deployment.connect().then(() => {
            console.log('Connect successful.');
            // fix local root
            if(config.localRoot.slice(-1) == '/')
                config.localRoot = config.localRoot.substr(0, config.localRoot.length - 1);
            // get deployment file
            require('./src/remote/get_deployment_file')(config.remoteRoot+config.deploymentFile, deployment).then(deployedFiles => {
                // create lists
                console.log('Creating deployment list of files.');
                require('./src/create_lists')(appRoot + config.localRoot, deployedFiles, config.ignore).then((lists) => {
                    // upload files from local list
                    process.stdout.write("\n"+'Uploading files...');
                    require('./src/remote/upload')(lists.localList, lists.remoteList, deployment, appRoot + config.localRoot, config.remoteRoot).then(uploaded => {
                        // lists.remoteList should be + localList now
                        process.stdout.write("\n"+'Renaming files...');
                        // rename uploaded files
                        require('./src/remote/rename')(uploaded, config.remoteRoot, deployment).then(() => {
                            // delete files
                            process.stdout.write("\n"+'Removing files...');
                            require('./src/remote/delete')(lists.toRemove, config.remoteRoot, deployment).then(() => {
                                // deploy deployment file
                                process.stdout.write("\n"+'Creating deployment file...');
                                require('./src/remote/create_deployment_file')(lists.remoteList, config.remoteRoot+config.deploymentFile, deployment).then(() => {
                                    // purge
                                    process.stdout.write("\n"+'Purge...');
                                    require('./src/remote/purge')(config.purge, deployment, config.remoteRoot).then(() => {
                                        console.log("\n"+'Deployment done.');
                                        deployment.close();
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    }
}





