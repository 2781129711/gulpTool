const fs = require('fs');
function readerFile(path) {
    return new Promise(function (resolve, reject) {
        fs.readFile(path, 'utf8', (err, str) => {
            if (err) return reject(err);
            resolve({ filePath: path, content: str });
        })
    })
};

module.exports=readerFile;