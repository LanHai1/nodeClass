// 加载http模块
let http = require('http');
// 加载path模块
let path = require('path');
// 加载fs模块
let fs = require('fs');


http.createServer(function (req, res) {// 创建服务
    let urlFile = req.url;// 获取浏览器地址栏上的路径
    // 必须写入响应报文头设置编码格式
    res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
    // 为不同的请求做出不同的响应处理
    if (urlFile === "/" || urlFile === "/index" || urlFile === "/index.html") {
        fs.readFile(path.join(__dirname, "html", "index.html"), function (err, data) {
            if (err) throw err;
            res.end(data);
        })
    } else if (urlFile === "/login" || urlFile === "/login.html") {
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
}).listen("8081", function () {// 启动服务成功
    console.log("服务器启动成功");
});