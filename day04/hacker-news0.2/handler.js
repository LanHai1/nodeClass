// 业务模块
// 加载配置模块
let config = require('./config.js');
let path = require('path');
let fs = require('fs');
let querystring = require('querystring');
// index 页面
module.exports.index = function (req, res) {
    readData(function (list) {
        res.rander(path.join(__dirname, "views", "index.html"), { list: list });
    })
}
// submit 页面
module.exports.submit = function (req, res) {
    res.rander(path.join(__dirname, "views", "submit.html"));
}
// item(details) 页面
module.exports.item = function (req, res) {
    let thisNewsId = Number(req.pathName.query.id);
    console.log(thisNewsId);
    readData(function (list) {
        let thisNews = null;
        for (let i = 0; i < list.length; i++) {
            if (thisNewsId === list[i].id) {
                thisNews = list[i];
                break;
            }
        }
        if (thisNews) {
            res.rander(path.join(__dirname, "views", "details.html"),{ttt:thisNews});
        } else {
            res.rander(path.join(__dirname, "views", "err.html"));
        }
    })
}

// add get 页面
module.exports.addGet = function (req, res) {
    readData(function (list) {
        req.pathName.query.id = list.length;
        // 解决提前跳转的异常 因为这里没有写全 少query
        list.push(req.pathName.query)
        writeData(JSON.stringify(list), function () {
            redirect(res);
        })
    })
}
// add post 页面
module.exports.addPost = function (req, res) {
    readData(function (list) {
        postBody(req, function (arr) {
            arr.id = list.length;
            list.push(arr);
            writeData(JSON.stringify(list), function () {
                redirect(res);
            })
        })
    })
}
// 图片、css等其他文件
module.exports.resources = function (req, res) {
    res.rander(path.join(__dirname, req.url));
}
// err
module.exports.handlerErr = function (req, res) {
    res.writeHead(404, 'Not Found', { 'Content-Type': 'text/html;charset=utf-8' });
    res.end('Page Not Found');
}
/**
 * 读取数据
 * @param {*} callback 回调函数 
 */
function readData(callback) {
    fs.readFile(config.dataPath, "utf8", function (err, data) {
        if (err && err.code != 'ENOENT') throw err;
        let list = JSON.parse(data || '[]');
        callback(list);
    })
}
/**
 * 写入数据
 * @param {string} list 
 * @param {*} callback 
 */
function writeData(list, callback) {
    fs.writeFile(config.dataPath, list, "utf8", function (err) {
        if (err) throw err;
        callback();
    })
}
/**
 * post 提交数据
 * @param {*} req 
 * @param {*} callback 
 */
function postBody(req, callback) {
    let arr = [];
    req.on('data', function (chunk) {
        arr.push(chunk)
    })
    req.on('end', function () {
        arr = Buffer.concat(arr);
        arr = arr.toString('utf8');
        arr = querystring.parse(arr);
        callback(arr);
    })
}
/**
 * 重定向
 * @param {*} res 
 */
function redirect(res) {
    res.statusCode = 302;
    res.statusMessage = 'Found';
    res.setHeader('Location', '/');
    res.end();
}








