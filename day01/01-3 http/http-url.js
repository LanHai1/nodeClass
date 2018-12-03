// 加载HTTP模版
let http = require("http");
// 创建HTTP服务对象
http.createServer(function (req, res) {// 回调函数
    // 设置编码格式
    res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
    let url = req.url;
    res.write("请求成功" + url );
    // 结束响应
    res.end();
}).listen("8080", function () {// 启动服务
    console.log("服务器启动成功，请访问http://localhost:8080");
});