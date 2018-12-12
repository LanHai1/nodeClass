// 业务处理模块
let path = require('path');
let fs = require('fs');
let querystring = require('querystring');

// 加载配置模块
let config = require('./config.js');

// index页面
module.exports.index = function (res) {
    readNewsData(function (list_n) {
        // 倒序数组
        list_n = list_n.reverse();
        res.rander(path.join(__dirname, "views", "index.html"), { list: list_n });
    });
}

// submit页面/请求其他文件 图片...
module.exports.html = function (res, filePath) {
    res.rander(filePath);
}

// item页面(details.html)
module.exports.item = function (req, res) {
    let newsId = Number(req.pathName.query.id);
    readNewsData(function (list_n) {
        let thisNes = null;
        for (let i = 0; i < list_n.length; i++) {
            if (list_n[i].id === newsId) {
                thisNes = list_n[i];
                break;
            }
        }
        if (thisNes) {
            res.rander(path.join(__dirname, "views", "details.html"), { ttt: thisNes });
        } else {
            res.rander(path.join(__dirname, "views", "err.html"));
        }
    })
}

// add get方法提交数据
module.exports.addGet = function (req, res) {
    readNewsData(function (list_n) {
        req.pathName.query.id = list_n.length;
        list_n.push(req.pathName.query);
        writeNewsData(JSON.stringify(list_n), function () {
            // 重定向
            redirect(res);
        });
    })
}

// add post方法提交数据
module.exports.addPost = function (req, res) {
    readNewsData(function (list_n) {
        postBodyData(req, function (arr) {
            arr.id = list_n.length;
            list_n.push(arr);
            writeNewsData(JSON.stringify(list_n), function () {
                // 重定向
                redirect(res);
            });
        })
    })
}

// 404错误
module.exports.handerErr = function(res){
    res.writeHead(404, "Not Found", { "Content-Type": "text/html;charset=utf-8" });
    res.end('<h1 style="color:red;">Page Not Found.</h1>');
}

/**
 * 读取文件
 * @param {*} callback 回调函数 => 返回数据
 */
function readNewsData(callback) {
    fs.readFile(config.dataPath, "utf8", function (err, data) {
        if (err && err.code != 'ENOENT') throw err;
        let list_n = JSON.parse(data || '[]');
        callback(list_n);
    })
}
/**
 * 写入文件
 * @param {*} list 写入的数据 要将json格式转换为字符串
 * @param {*} callback 回调函数 <= 写入逻辑代码 
 */
function writeNewsData(list, callback) {
    fs.writeFile(config.dataPath, list, "utf8", function (err) {
        if (err) throw err;
        // 直接调用回调函数 在回调函数中写业务逻辑
        callback();
    })
}
/**
 * 获取post提交的数据
 * @param {*} callback 回调函数 => 返回post提交的数据 未添加id
 */
function postBodyData(req, callback) {
    let arr = [];
    req.on('data', function (chunk) {
        arr.push(chunk);
    })
    req.on('end', function () {
        arr = Buffer.concat(arr);
        arr = arr.toString("utf8");
        arr = querystring.parse(arr);
        callback(arr);
    })
}
/**
 * // 重定向 跳转页面
 * @param {*} res 
 */
function redirect(res) {
    res.statusCode = 302;
    res.statusMessage = 'Found';
    res.setHeader('Location', '/');
    res.end();
}