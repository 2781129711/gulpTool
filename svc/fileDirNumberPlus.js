var fs = require('fs');
var path = require('path');

var fileListJS = [];
var fileListCss=[];
var fileListHTML=[];
var fileListImg=[];

var folderList=[];
// var timeStart = new Date();
var filePath = path.resolve('./temp/web');
// var newFilePath=path.resolve("./dist");

//计数法
function readDirRecur(folder, callback) {
    fs.readdir(folder, function(err, files) {
        var count = 0
        var checkEnd = function() {
            ++count == files.length && callback()
        }

        files.forEach(function(file) {
            // var fullPath = folder + '/' + file;
            var fullPath=path.join(folder,file);
            // var newFilePath=path.resolve('./dist')+file;
            
            // console.log("folder",folder);
            // console.log("file:",file);
            // console.log("============================================")
            fs.stat(fullPath, function(err, stats) {
                if (stats.isDirectory()) {
                    folderList.push(fullPath);
                    return readDirRecur(fullPath, checkEnd);
                } else {
                    
                    /*not use ignore files*/
                    if (file[0] == '.') {

                    } else {
                        let node={fullPath:fullPath,fileName:file};
                        let suffix=file.split('.')[1];
                        if(suffix=='js'){
                            fileListJS.push(node)
                        }else if(suffix=='css'||suffix=='less'){
                            fileListCss.push(node)
                        }else if(suffix=='html'||suffix=='htm'){
                            fileListHTML.push(node);
                        }else if(suffix=='jpg'||suffix=='png'||suffix=='jpeg'||suffix=='svg'){
                            fileListImg.push(node);
                        }
                    }
                    checkEnd()
                }
            })
        })

        //为空时直接回调
        files.length === 0 && callback()
    })
}

module.exports = function(callback) {
    // console.log("filePath:",filePath);
    readDirRecur(filePath, function() {
        // console.log('done', new Date() - timeStart); //done 3
        // console.log(fileList); //打印出目录下的所有文件
        callback({
            fileListJS,
            fileListCss,
            fileListHTML,
            fileListImg,
            folderList
        });
    })
}