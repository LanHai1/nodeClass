// 扩展req res对象模块
let fs = require('fs');
let mime = require('mime');
let _ = require('underscore');
let url = require('url');

module.exports = function (req, res) {
    req.url = req.url.toLowerCase();
    req.method = req.method.toLowerCase();
    req.pathName = url.parse(req.url, true);
    res.rander = function (filePath, xrData) {
        fs.readFile(filePath, function (err, data) {
            if (err) {
                res.writeHead(404, "Not Found", { "Content-Type": "text/html;charset=utf-8" });
                return;
            }
            if (xrData) {
                data = _.template(data.toString("utf8"))(xrData);
            }
            res.writeHead(200, "OK", { "Content-Type": mime.getType(filePath) + ";charset=utf-8" });
            res.end(data);
        })
    }
}