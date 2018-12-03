let fs = require('fs');
let path = require('path');
// ----写入文件
// 写入的内容
let fag = "复习写入文件";
// 路径
let pathFlie = path.join(__dirname, "write.js");
fs.writeFile(pathFlie, fag, "utf8", function (err) {
    err ? console.log("写入文件错误" + err) : console.log("写入文件成功");
});
// ----读取文件
fs.readFile(pathFlie, "utf8", function (err, data) {
    if (err) {
        throw err;// 抛异常
    }
    console.log(data);
});
// ----创建一级目录
let directoryFile_1 = path.join(__dirname, "directory");
fs.mkdir(directoryFile_1, function (err) {
    err ? console.log("创建目录错误" + err) : console.log("创建目录成功");
});
// ----创建二级目录
let directoryFile_2 = [path.join(directoryFile_1, "child_1"), path.join(directoryFile_1, "child_2"), path.join(directoryFile_1, "child_3")];

for (let i = 0; i < directoryFile_2.length; i++) {
    fs.mkdir(directoryFile_2[i], function (err) {
        err ? console.log("创建目录错误" + err) : console.log("创建目录成功");
    });
}


// let file = [{
//     name: "f1",
//     child: [{ name: "f1_1", child: [{ name: "f1_2" }] }]
// }, {
//     name: "f2",
//     child: [{ name: "f2_1", child: [{ name: "f2_2" }] }]
// }, {
//     name: "f3",
//     child: [{ name: "f3_1", child: [{ name: "f3_2" }] }]
// }]
// for (let i = 0; i < file.length; i++) {
//     for (let key in file[i]) {
//         console.log(file[i][key])
//     }
// }
