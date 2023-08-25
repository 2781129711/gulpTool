const fs = require('fs')

function copyDir(src, dist, callback) {
    fs.access(dist, function(err){
        if(err){
            // 目录不存在时创建目录
            fs.mkdirSync(dist);
        }
        _copy(null, src, dist);
    });

    function _copy(err, src, dist) {
        if(err){
            callback(err);
        } else {
            try {
                const paths = fs.readdirSync(src)
                paths.forEach(function(path) {
                    const _src = src + '/' +path;
                    const _dist = dist + '/' +path;
                    fs.stat(_src, function(err, stat) {
                        if(err){
                            callback(err);
                        } else {
                            // 判断是文件还是目录
                            if(stat.isFile()) {
                                fs.writeFileSync(_dist, fs.readFileSync(_src));
                            } else if(stat.isDirectory()) {
                                // 当是目录是，递归复制
                                copyDir(_src, _dist, callback)
                            }
                        }
                    })
                })
            } catch (err) {
                callback(err)
            }
        }
    }
}


module.exports=copyDir;