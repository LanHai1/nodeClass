// 业务模块
let path = require('path');
let fs = require('fs');
let _ = require('underscore');
let querystring = require('querystring');

// 配置模块
let config = require('./config.js');

// index页面
module.exports.indexs = function (req, res) {
    readData(function (list) {
        res.rander(path.join(__dirname, "views", "index.html"), { list: list });
    })
}
// submit页面
module.exports.submit = function (req, res) {
    res.rander(path.join(__dirname, "views", "submit.html"));
}
// item页面（）
module.exports.item = function (req, res) {
    let thisNewsId = Number(req.pathName.query.id);
    readData(function (list) {
        let thisNews = null;
        for (let i = 0; i < list.length; i++) {
            if (list[i].id === thisNewsId) {
                thisNews = list[i];
                break;
            }
        }
        if (thisNews) {
            res.rander(path.join(__dirname, "views", "details.html"), { ttt: thisNews });
        } else {
            res.rander(path.join(__dirname, "views", "err.html"));
        }
    })
}
// add get请求
module.exports.addGet = function (req, res) {
    readData(function (list) {
        req.pathName.query.id = list.length;
        list.push(req.pathName.query)
        wirteData(JSON.stringify(list), function () {
            console.log(list, "1+++")
            redirect(res);
        })
    })
}
// add post请求
module.exports.addPost = function (req, res) {
    readData(function (list) {
        postBody(req, function (arr) {
            arr.id = list.length;
            list.push(arr);
            wirteData(JSON.stringify(list), function () {
                redirect(res);
            })
        })
    })
}
// resources 其他文件 css img...
module.exports.resources = function (req, res) {
    res.rander(path.join(__dirname, req.url));
}
// err
module.exports.handerErr = function (req, res) {
    res.writeHead(404, "Not Found", { "Context-Type": "text/html;charset=utf8" });
    res.end('Page Not Found');
}
function readData(callback) {
    fs.readFile(config.dataPath, "utf8", function (err, data) {
        if (err && err.code != 'ENOENT') throw err;
        let list = JSON.parse(data || '[]');
        callback(list);
    })
}
function wirteData(list, callback) {
    fs.writeFile(config.dataPath, list, "utf8", function (err) {
        if (err) throw err;
        callback(list);
    })
}
function postBody(req, callback) {
    let arr = [];
    req.on("data", function (chunk) {
        arr.push(chunk);
    })
    req.on("end", function () {
        arr = Buffer.concat(arr);
        arr = arr.toString('utf8');
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