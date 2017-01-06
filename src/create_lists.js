const fs  = require('fs');
const md5file = require('md5-file');
const tracer = require('./tracer');

module.exports = function (localRoot, deployedFiles, ignore) {
    return new Promise((resolve, reject) => {
        // add prefix to ignore files
        ignore = ignore.map(value => {
            return localRoot + value;
        });
        // create local list
        let localList = getFiles(localRoot, ignore);
        let newLocalList = [];
        let newRemoteList = [];
        // remove not changed files from local list
        let counter = 0;
        for(let i = 0; i < localList.length; i++){
            // try to find file in deployment file
            let index = undefined;
            deployedFiles.find((element, idx) => {
                if(element.name == localList[i].name){
                    index = idx;
                }
            })
            if(index !== undefined && deployedFiles[index].md5 == localList[i].md5){
                counter++;
                if(counter % 10 == 0)
                    tracer.dot();
                newRemoteList.push(localList[i]);
            } else {
                counter++;
                if(counter % 10 == 0)
                    process.stdout.write('.');
                newLocalList.push(localList[i]);
            }
            if(index !== undefined){
                deployedFiles = deployedFiles.filter(value => {
                    return value.name != localList[i].name;
                });
            }
        }
        //process.stdout.write("\n");
        resolve({
            localList: newLocalList,
            remoteList: newRemoteList,
            toRemove: deployedFiles
        });
    });
}

function getFiles(dir, ignore, prefix = '', counter = 0){
    let list = [];
    let files = fs.readdirSync(dir);
    for(let i = 0; i < files.length; i++){
        counter++;
        if(counter % 10 == 0)
            tracer.dot();
        let filename = dir+'/'+files[i];
        if(ignore.indexOf(filename) == -1){
            if(fs.lstatSync(filename).isFile()){
                let md5 = null;
                try{
                    md5 = md5file.sync(filename);
                } catch(e) {
                    md5 = null;
                }
                list.push({
                    name: prefix + '/' + files[i],
                    md5: md5
                });
            } else if(fs.lstatSync(filename).isDirectory()){
                list = list.concat(getFiles(filename, ignore, prefix + '/' +files[i], counter));
            }
        }
    }
    return list;
}