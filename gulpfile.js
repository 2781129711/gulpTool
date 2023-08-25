
const path = require('path');
const gulp = require('gulp');
const rev = require('gulp-rev-dxb');	         // 生成版本号清单
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const htmlmin = require('gulp-htmlmin');
const runSequence = require('run-sequence');  // 按顺序执行task
const imagemin = require('gulp-imagemin');
const minifyCss = require('gulp-minify-css');
const copyDir = require('./nodeSvc/fileCopy');
const delDir = require("./nodeSvc/fileDelete");
const getUUID = require("./nodeSvc/toolGuid");
const readerFile=require("./nodeSvc/fileReaderPromise");
const fileReplaceTag=require("./nodeSvc/fileReplaceTag");
const fileDirNumberPlus = require("./nodeSvc/fileDirNumberPlus");

let fileListJS = [], fileListCss = [], fileListHTML = [], fileListImg = [], folderList = [];
let htmlFileName = [];

function mainApp(callback) {
    delDir("./dist/web");
    fileDirNumberPlus((result) => {
        callback(result);
    });
};

gulp.task('mainApp', (callback) => {
    mainApp((result) => {

        fileListJS = result.fileListJS;
        fileListImg = result.fileListImg;
        fileListCss = result.fileListCss;
        fileListHTML = result.fileListHTML;

        fileListJS.forEach(item => {
            let fileName = item.fileName;
            let newPath = item.fullPath.replace("\\temp\\web\\", '\\dist\\web\\').replace('\\' + fileName, '');

            let uuid = getUUID();
            // let prefixName=fileName.split('.')[0];
            // let suffixName=fileName.split('.')[1];
            item.mapName = 'script-' + uuid + '.js';

            gulp.src(item.fullPath)
                .pipe(uglify())
                .pipe(rename({
                    // dirname: "main/text/ciao",
                    basename: "script",
                    // prefix: "bonjour-",
                    suffix: "-" + uuid,
                    // extname: ".md"
                }))
                .pipe(gulp.dest("./dist/web/js"));

            // console.log(item.fullPath)
        });

        fileListCss.forEach((item) => {
            let fileName = item.fileName;
            let newPath = item.fullPath.replace("\\temp\\web\\", '\\dist\\web\\').replace('\\' + fileName, '');

            let uuid = getUUID();
            // let prefixName=fileName.split('.')[0];
            // let suffixName=fileName.split('.')[1];
            item.mapName = 'css-' + uuid + '.css';

            gulp.src(item.fullPath)
                .pipe(minifyCss())
                .pipe(rename({
                    // dirname: "main/text/ciao",
                    basename: "css",
                    // prefix: "bonjour-",
                    suffix: "-" + uuid,
                    // extname: ".md"
                }))
                .pipe(gulp.dest("./dist/web/css"));
            // console.log(item.fullPath)
        });

        fileListHTML.forEach((item) => {
            let fileName = item.fileName;
            let newPath = item.fullPath.replace("\\temp\\web\\", '\\dist\\web\\').replace('\\' + fileName, '');
            var options = {
                collapseWhitespace: true,        //清除空格，压缩html
                collapseBooleanAttributes: false,//省略布尔属性的值
                removeComments: true,            //清除html中注释的部分
                removeEmptyAttributes: false,    //清除所有的空属性
                removeScriptTypeAttributes: false,//清除所有script标签中的type="text/javascript"属性
                removeStyleLinkTypeAttributes: false,//清除所有Link标签上的type属性
                minifyJS: true,                   //压缩html中的javascript代码
                minifyCSS: true                   //压缩html中的css代码
            };
            gulp.src(item.fullPath)
                // .pipe(htmlmin(options))
                .pipe(gulp.dest(newPath));
            // console.log(item.fullPath)
            htmlFileName.push(newPath + '\\' + fileName);
        });
        callback();
    });
});

gulp.task("asyncReader", function (callback) {
    setTimeout(() => {
        let fileHTMLListPromise = [];
        htmlFileName.forEach(path => {
            fileHTMLListPromise.push(readerFile(path));
        });

        Promise.all(fileHTMLListPromise).then(result => {
            fileReplaceTag(result);
        }).catch(e => 
            console.log(e)
        );
        callback();
    }, 4000);
})

gulp.task("asyncReplace",function(callback){
    callback();
})

gulp.task("default", gulp.series('mainApp', 'asyncReader', (done) => {
    done();
}));