let http = require('http');
let fs = require('fs');
let path = require('path');
let url = require('url');
let querystring = require('querystring');
let mime = require('mime');
let _ = require('underscore');

http.createServer(function (req, res) {
    let reqUrl = req.url.toLowerCase();
    let reqMethod = req.method.toLowerCase();
    let urlObj = url.parse(reqUrl, true);
    let fileData = path.join(__dirname, "data", "data-test.json");
    let list = [];
    res.errHead = function () {
        res.writeHead(404, 'Not Found', { "Content-Type": 'text/html;charset=utf-8' });
        res.end('Page Not Found.');
    }
    res.rander = function (fileUrl, tpldata) {
        fs.readFile(fileUrl, function (err, data) {
            if (err) {
                res.errHead();
                return;
            }
            if (tpldata) {
                data = _.template(data.toString("utf8"))(tpldata);
            }
            res.writeHead(200, 'OK', { "Content-Type": mime.getType(fileUrl) + ';charset=utf-8' });
            res.end(data);
        })
    }
    res.readData = function (fileData, list) {
        fs.readFile(fileData, "utf8", function (err, data) {
            if (err && err.code != 'ENOENT') throw err;
            list.push(JSON.parse(data || '[]'));
        })
    }
    res.timeWrite = function (fileData, list) {
        setTimeout(function () {
            fs.writeFile(fileData, JSON.stringify(list), "utf8", function (err) {
                if (err) throw err;
                res.statusCode = 302;
                res.statusMessage = 'Found';
                res.setHeader('Location', "/");
                res.end();
            })
        }, 300);
    }

    if (reqUrl === "/" || reqUrl === "/index" || reqUrl === "/index.html" && reqMethod === "get") {
        fs.readFile(fileData, "utf8", function (err, data) {
            if (err && err.code != 'ENOENT') throw err;
            let list_data = (JSON.parse(data || '[]'));
            res.rander(path.join(__dirname, "views", "index.html"), { list: list_data });
            
        })
    } else if (reqUrl === "/details" || reqUrl === "/details.html" && reqMethod === "get") {
        res.rander(path.join(__dirname, "views", "details.html"));
    } else if (reqUrl === "/submit" || reqUrl === "/submit.html" && reqMethod === "get") {
        res.rander(path.join(__dirname, "views", "submit.html"));
    } else if (reqUrl.indexOf("/add") >= 0 && reqMethod === "get") {
        res.readData(fileData, list);
        list.push(urlObj.query);
        res.timeWrite(fileData, list);
    } else if (reqUrl.indexOf("/add") >= 0 && reqMethod === "post") {
        res.readData(fileData, list);
        let arr = [];
        req.on("data", function (chunk) {
            arr.push(chunk);
        })
        req.on("end", function () {
            arr = Buffer.concat(arr);
            arr = arr.toString('utf-8');
            list.push(querystring.parse(arr));
        })
        res.timeWrite(fileData, list);
    } else if (reqUrl.indexOf("/resources") >= 0 && reqMethod === "get") {
        res.rander(path.join(__dirname, reqUrl));
    } else {
        res.errHead();
    }
}).listen(8081, function () {
    console.log('服务器启动成功，请访问http://localhost:8081');
})