let fs = require('fs');
let http = require('http');
let path = require('path');
let mime = require('mime');

http.createServer(function (req, res) {
    let url = req.url;
    let pathDir = path.join(__dirname, "public", url);
    fs.readFile(pathDir, function (err, data) {
        if (err) {
            console.log(err);
            res.end("404");
        } else {
            res.writeHead(200, { 'Content-Type': mime.getType(pathDir) + ';charset=utf-8' })
            res.end(data);
        }
    })
}).listen(8080, function () {
    console.log("服务器启动成功，请访问http://localhist:8080/index.html");
});