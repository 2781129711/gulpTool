// 简单实现一个promisify
function promisify(fn) {
    return function() {
        var args = arguments;
        return new Promise(function(resolve, reject) {
            [].push.call(args, function(err, result) {
                if (err) {
                    console.log(err)
                    reject(err);
                } else {
                    resolve(result);
                }
            });
            fn.apply(null, args);
        });
    }
}

var fs = require('fs');
var path = require("path");
var readdir = promisify(fs.readdir);
var stat = promisify(fs.stat);
var readFile = promisify(fs.readFile);

function readDirRecur(file, callback) {
    return readdir(file).then((files) => {
        files = files.map((item) => {
            var fullPath = file + '/' + item;

            return stat(fullPath).then((stats) => {
                if (stats.isDirectory()) {
                    return readDirRecur(fullPath, callback);
                } else {
                    /*not use ignore files*/
                    if (item[0] == '.') {
                        //console.log(item + ' is a hide file.');
                    } else {
                        callback && callback(fullPath)
                    }
                }
            })
        });
        return Promise.all(files);
    });
}


var fileList = []

var timeStart = new Date()
var filePath = path.resolve('./web')

readDirRecur(filePath, function(filePath) {
    fileList.push(filePath)
}).then(function() {
    console.log('done', new Date() - timeStart); //done 3.3
    console.log(fileList); //打印出来目录下的所有文件
}).catch(function(err) {
    console.log(err);
});