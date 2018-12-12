let fs = require('fs');
let path = require('path');
let url = require('url');
let mime = require('mime');
let querystring = require('querystring');
let _ = require('underscore');
require('http').createServer(function (req, res) {
    let reqUrl = req.url.toLowerCase();
    let reqMethod = req.method.toLowerCase();
    let urlObj = url.parse(reqUrl, true);
    res.rander = function (filePath, xrData) {
        fs.readFile(filePath, function (err, data) {
            if (err) {
                res.writeHead(404, 'Not Found', { "Content-Type": "text/html;charset=utf-8" });
                res.end('Page Not Found')
            }
            if (xrData) {
                data = _.template(data.toString('utf8'))(xrData)
            }
            res.writeHead(200, 'OK', { "Content-Type": mime.getType(filePath) + ";charset=utf-8" });
            res.end(data)
        })
    }
    if (reqUrl === '/' || reqUrl === '/index' || reqUrl === '/index.html' && reqMethod === "get") {
        readData(function (list) {
            res.rander(path.join(__dirname, "views", "index.html"), { list: list })
        })
    } else if (reqUrl === '/submit' || reqUrl === '/submit.html' && reqMethod === "get") {
        res.rander(path.join(__dirname, "views", "submit.html"))
    } else if (reqUrl.indexOf('/item') >= 0 && reqMethod === "get") {
        let thisNewsID = Number(urlObj.query.id);
        readData(function (list) {
            let thisNews = null;
            for (let i = 0; i < list.length; i++) {
                if (list[i].id === thisNewsID) {
                    thisNews = list[i];
                    break;
                }
            }
            if (thisNews) {
                res.rander(path.join(__dirname, "views", "details.html"), { ttt: thisNews })
            } else {
                res.rander(path.join(__dirname, "views", "err.html"))
            }
        })
    } else if (reqUrl.indexOf('/add') >= 0 && reqMethod === "get") {
        readData(function (list) {
            urlObj.query.id = list.length;
            list.push(urlObj.query);
            writeData(JSON.stringify(list), function () {
                redirect(res);
            })
        })
    } else if (reqUrl.indexOf('/add') >= 0 && reqMethod === "post") {
        readData(function (list) {
            let arr = [];
            req.on("data", function (chunk) {
                arr.push(chunk);
            })
            req.on("end", function () {
                arr = Buffer.concat(arr);
                arr = arr.toString('utf8');
                arr = querystring.parse(arr);
                arr.id = list.length;
                list.push(arr);
                writeData(JSON.stringify(list), function () {
                    redirect(res);
                })
            })
        })
    } else if (reqUrl.indexOf('/resources') >= 0 && reqMethod === "get") {
        res.rander(path.join(__dirname, reqUrl))
    } else {
        res.writeHead(404, 'Not Found', { "Content-Type": "text/html;charset=utf-8" });
        res.end('Page Not Found');
    }
}).listen(8082, function () {
    console.log('服务器启动成功请访问http://localhost:8082')
})
function readData(callback) {
    let dataPath = path.join(__dirname, "data", "data_test.json");
    fs.readFile(dataPath, "utf8", function (err, data) {
        if (err && err.code != "ENOENT") throw err;
        let list = JSON.parse(data || '[]');
        callback(list);
    })
}
function writeData(list, callback) {
    let dataPath = path.join(__dirname, "data", "data_test.json");
    fs.writeFile(dataPath, list, "utf8", function (err) {
        if (err) throw err;
        callback();
    })
}
function redirect(res) {
    res.statusCode = 302;
    res.statusMessage = 'Found';
    res.setHeader("Location", "/");
    res.end();
}