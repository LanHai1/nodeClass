// 扩展模块
let url = require('url');
let fs = require('fs');
let _ = require('underscore');
let mime = require('mime');
module.exports = function (req, res) {
    req.url = req.url.toLowerCase();
    req.method = req.method.toLowerCase();
    req.pathName = url.parse(req.url, true);
    res.rander = function (fileData, xrData) {
        fs.readFile(fileData, function (err, data) {
            if (err) {
                console.log(err);
                res.writeHead(404, 'Not Found', { 'Content-Type': 'text/html;charset=utf-8' });
                return;
            }
            if (xrData) {
                data = _.template(data.toString("utf8"))(xrData);
            }
            res.writeHead(200, 'OK', { 'Content-Type': mime.getType(fileData) + ';charset=utf-8' });
            res.end(data);
        })
    }
}