const fs = require('fs');
const path = require("path");
const dirname = path.resolve("./web");
let timer = null;
console.log("dirname:", dirname);


const allFilePath = [];

function reduceFileDir(filePath, callback) {
    //根据文件路径读取文件，返回文件列表
    fs.readdir(filePath, function(err, files) {
        // console.log("files:", files);
        if (err) {
            console.error("Error:", err);
            return;
        }
        files.forEach((fileName) => {
            //  //获取当前文件的绝对路径
            const fileDir = path.join(filePath, fileName);
            // console.log("fileDir:", fileDir);
            //fs.stat(path)执行后，会将stats类的实例返回给其回调函数。
            fs.stat(fileDir, (e, stats) => {
                if (e) {
                    console.error('Error:', e);
                    return;
                }
                // 是否是文件
                const isFile = stats.isFile();

                if (isFile) {
                    allFilePath.push(fileDir);
                    if (timer) clearTimeout(timer);
                    timer = setTimeout(() => {
                        callback && callback(allFilePath);
                    }, 200);
                }

                // 是否是文件夹
                const isDir = stats.isDirectory();

                if (isDir) {
                    reduceFileDir(fileDir, callback);
                }
            })
        })
    })
}

reduceFileDir(dirname, (value) => {
    console.log(value, '-=');
});

module.exports = reduceFileDir;