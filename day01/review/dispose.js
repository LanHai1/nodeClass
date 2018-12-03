let fs = require('fs');
let http = require('http');
let path = require('path');

let urlFile = path.join(__dirname, "write.js");
fs.writeFile(urlFile, "", "utf8", function (err) {
    if (err) throw err;
    console.log("写入文件成功");
})

http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
    let url = req.url;
    if (url === "/" || url === "index.html" || url === "index") {
        fs.readFile(path.join(__dirname, "html", "index.html"), function (err, data) {
            if (err) throw err;
            res.end(data);
        })
    } else if (url === "login.html" || url === "login") {
        fs.readFile(path.join(__dirname, "html", "login.html"), function (err, data) {
            if (err) throw err;
            res.end(data);
        })
    } else {
        fs.readFile(path.join(__dirname, "html", "err.html"), function (err, data) {
            if (err) throw err;
            res.end(data);
        })
    }

}).listen("8080", function () {
    console.log("服务器启动成功，请访问http://localhost:8080");
});