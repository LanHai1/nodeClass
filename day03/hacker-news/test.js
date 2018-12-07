let fs = require('fs');
let path = require('path');
let url = require('url');
let mime = require('mime');
let querystirng = require('querystring');
let _ = require('underscore');
require('http').createServer(function (req, res) {
    let reqUrl = req.url.toLowerCase();
    let reqMethod = req.method.toLowerCase();
    let urlObj = url.parse(reqUrl, true);
    var list = [];
    let dataPath = path.join(__dirname, "data", "data_test.json");
    res.rander = function (filePath, xrData) {
        fs.readFile(filePath, function (err, data) {
            if (err) {
                res.writeHead(404, 'Not Found', { "Content-Type": "text/html;charset=utf-8" });
                return;
            }
            if (xrData) {
                data = _.template(data.toString("utf8"))(xrData);
            }
            res.writeHead(200, 'OK', { "Content-Type": mime.getType(filePath) + ";charset=utf-8" });
            res.end(data);
        })
    }
    if (reqUrl === '/' || reqUrl === '/index' || reqUrl === '/index.html' && reqMethod === "get") {
        readData(function (list_n) {
            list_n = list_n.reverse();
            res.rander(path.join(__dirname, "views", "index.html"), { list: list_n });
        })
    } else if (reqUrl === '/submit' || reqUrl === '/submit.html' && reqMethod === "get") {
        res.rander(path.join(__dirname, "views", "submit.html"))
    } else if (reqUrl.indexOf('/item') >= 0 && reqMethod === "get") {
        let thisNewsId = Number(urlObj.query.id);
        let thisNews = null;
        readData(function (list_n) {
            for (let i = 0; i < list_n.length; i++) {
                if (list_n[i].id === thisNewsId) {
                    thisNews = list_n[i];
                    break;
                }
            }
            if (thisNews) {
                res.rander(path.join(__dirname, "views", "details.html"), { ttt: thisNews });
            } else {
                res.rander(path.join(__dirname, "views", "err.html"))
            }
        })
    } else if (reqUrl.indexOf('/add') >= 0 && reqMethod === "get") {
        readData(function (list) {
            urlObj.query.id = list.length;
            list.push(urlObj.query)
            wirteData(JSON.stringify(list), function () {
                redirect(res);
            })
        })
    } else if (reqUrl.indexOf('/add') >= 0 && reqMethod === "post") {
        readData(function (list) {
            postBody(req, function (arr) {
                arr.id = list.length;
                list.push(arr);
                wirteData(JSON.stringify(list), function () {
                    redirect(res);
                })
            })
        })
    } else if (reqUrl.indexOf('/resources') >= 0 && reqMethod === "get") {
        res.rander(path.join(__dirname, reqUrl))
    } else {
        res.writeHead(404, 'Not Found', { "Content-Type": "text/html;charset=utf-8" });
        res.end("<h1>Page Not Found.</h1>")
    }
}).listen(8080, function () {
    console.log('服务器启动成功请访问http://localhost:8080')
})

/**
 * 读取数据
 * @param {*} callback 回调函数
 */
function readData(callback) {
    let dataPath = path.join(__dirname, "data", "data_test.json");
    fs.readFile(dataPath, "utf8", function (err, data) {
        if (err && err.code != 'ENOENT') throw err;
        let list_n = JSON.parse(data || "[]");
        callback(list_n);
    })
}
/**
 * 写入数据
 * @param {string} list 数据
 * @param {*} callback 回调函数
 */
function wirteData(list, callback) {
    let dataPath = path.join(__dirname, "data", "data_test.json");
    fs.writeFile(dataPath, list, "utf8", function (err) {
        if (err) throw err;
        // 回调函数 读取数据后处理代码
        callback();
    })
}
/**
 * post请求的数据
 * @param {*} req 
 * @param {*} callback 回调函数
 */
function postBody(req, callback) {
    let arr = [];
    // 监听data事件 用户传来的数据
    req.on('data', function (chunk) {
        arr.push(chunk);
    })
    // 监听end事件，数据接受完毕
    req.on('end', function () {
        arr = Buffer.concat(arr);
        arr = arr.toString("utf8");
        arr = querystirng.parse(arr);
        // 回调函数 返回数据
        callback(arr);
    })
}
/**
 * 重定向 跳转页面
 * @param {*} res 
 */
function redirect(res) {
    res.statusCode = 302;
    res.statusMessage = 'Not Found';
    res.setHeader('Location', '/');
    res.end();
}