// 创建一个简单的http服务器程序

// 1.加载http模块
let http = require('http');
// 2.创建一个http服务对象
let server = http.createServer();
// 3.监听用户的请求事件(request事件)
// request:获取用户提交过来的数据对象，请求报文里面的内容
// response:向用户响应的数据对象，请求处理的结果
server.on("request", function (request, response) {
    // 设置编码格式 服务器需发送响应报文头，告诉浏览器编码格式
    response.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
    response.write("hello Node你好");
    // 请求结束后一定要结束响应
    response.end();
});
// 4.启动服务
server.listen(8080, function () {
    console.log("服务器已启动，请访问http://localhost:8080");
});

//写入文件
let fs = require('fs');
let path = require('path');
let urlFile = path.join(__dirname, "http-url.js");
fs.writeFile(urlFile, "", "utf8", function (err) {
    if(err) throw err;
    console.log("写入文件成功！");
})