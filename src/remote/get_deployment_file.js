module.exports = function (filename, deployment) {
    return new Promise((resolve, reject) => {
        deployment.getFileContent(filename).then(content => {
            if(content){
                console.log('Deployment file ok.');
                resolve(JSON.parse(content));
            } else {
                console.log('Deployment file not found or empty.');
                resolve([]);
            }
        }).catch(e => {
            if(e.message == 'No such file'){
                console.log('Deployment file not found.');
                resolve([]);
            } else {
                throw e;
            }
        })
    });
}