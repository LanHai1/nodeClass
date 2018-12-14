// 业务模块
let path = require('path');
let fs = require('fs');
let querystring = require('querystring');
let config = require('./config.js');
module.exports.index = function (req, res) {
    res.rander(path.join(__dirname, "views", "index.html"));
}
module.exports.submit = function (req, res) {
    res.rander(path.join(__dirname, "views", "submit.html"));
}
module.exports.item = function (req, res) {
    res.rander(path.join(__dirname, "views", "details.html"));
}
module.exports.addGet = function (req, res) {
    readData(function(list){
        req.pathName.query.id = list.length;
        list.push(req.pathName.query);
        writeData(JSON.stringify(list),function(){
            redirect(res);
        })
    })
}
module.exports.addPost = function (req, res) {

}
module.exports.resources = function (req, res) {
    res.rander(path.join(__dirname, req.url));
}
module.exports.handerErr = function (req, res) {
    res.writeHead(404, "Not Found", { 'Content-Type': 'text/html;charset=utf-8' });
    res.end('Page Not Found');
}
function readData(callback) {
    fs.readFile(config.dataPath, "utf8", function (err, data) {
        if (err && err.code != 'ENOENT') throw err;
        let list = JSON.parse(data || '[]');
        callback(list);
    })
}
function writeData(list, callback) {
    fs.writeFile(config.dataPath, list, "utf8", function (err) {
        if (err) throw err;
        callback();
    })
} 
function postBody(req,callback) {
    let arr = [];
    req.on("data",function(chunk){
        arr.push(chunk);
    })
    req.on("end",function(){
        arr = Buffer.concat(arr);
        arr = arr.toString("utf8");
        arr = querystring.parse(arr);
        callback(arr);
    })
}
function redirect(res) {
    res.statusCode = 302;
    res.statusMessage = 'Found';
    res.setHeader("Location", "/");
    res.end();
}