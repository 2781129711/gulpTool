
const fs = require('fs');


function escapeRegExp(str){
    if(!str)return '';
    return str.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
}

function replaceAll(str,find,replace){
    return str.replace(new RegExp(escapeRegExp(find),'g'),replace);
}

function fileReplaceTag(params){
    let {filePath,content}=params;
    return new Promise(function(resolve,reject){

    });
}

module.exports=fileReplaceTag;