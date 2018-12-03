// ---------写入文件
// let fs = require('fs');
// let mag = "第一次node写入文件";
// fs.writeFile("./written.txt",mag,"utf8",function(err){
//     // 说明文件写入不成功
//     if(err){
//         console.log("文件写入出错啦"+err);
//     }else{
//         console.log("OK");
//     }
// })

// ---------读取文件
// let fs = require('fs');
// fs.readFile("written.txt", "utf8", function (err, data) {
//     if (err) {
//         console.log("文件读取错误啦" + err);
//     } else {
//         console.log(data);
//     }
// })

//----test 写读文件速度
// let fs = require('fs');
// let mag = "console.log(1)";
// //----写入文件
// fs.writeFile("test1.js", mag, "utf8", function (err) {
//     console.log("writeFile");
//     err ? console.log("写入文件错误啦" + err) : console.log("OK");
// })
// //----读取文件
// fs.readFile("./test.js", null, function (err, data) {
//     console.log("readFile");
//     err ? console.log("读取文件错误啦" + err) : console.log(data);
// });

// 解决文件读取中 ./相对路径的问题
// let fs = require('fs');
// // __dirname:表示当前正在运行的js文件所在的目录
// // __filename:表示当前正在运行的js的完整目录
// // path模块路径拼接 为了兼容win和OX系统的路径
// let path = require('path');
// let dirnameFile = path.join(__dirname, "test.js");
// fs.readFile(dirnameFile, "utf8", function (err, data) {
//     err ? console.log("读取文件错误啦" + err) : console.log(data);
// })

//---------创建目录
let fs = require("fs");
let path = require("path");
let dirnameFile = path.join(__dirname, "Node.js介绍");
fs.mkdir(dirnameFile, function (err) {
    err ? console.log("创建目录错误" + err) : console.log("创建目录OK");
})