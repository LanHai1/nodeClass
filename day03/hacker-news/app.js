// 入口函数

// 加载模块
let http = require('http');
let path = require('path');
let fs = require('fs');
let mime = require('mime');
let url = require('url');

// 设计路由
// index.html === "/"||"/index"||"/index.html" 主页面
// submit.html === "/submit"||"/submit.html" 添加新闻页面
// details.html === "/details"||"/details.html" 新闻详情页面
// "/add" get方式添加一条新闻
// "/add" post方式添加一条新闻

// 创建一个服务器对象
http.createServer(function (req, res) {

    // 请求文件函数
    res.rander = function (dirPath) {
        fs.readFile(dirPath, function (err, data) {
            if (err) {
                // res.writeHead(404, 'Not Fount', { "Content-Type": 'text/html;charset=utf-8' });
                // res.end("404, Page Not Fount.");
                res.resHeader(404, 'Not Fount', 'text/html');
                return;
            };
            res.writeHead(200, 'OK', { "Content-Type": mime.getType(dirPath) + ';charset=utf-8' });
            res.end(data);
        })
    }

    // 错误响应报文头
    /**
     * code 响应状态码 int
     * message 响应状态码对应的消息 string
     * type 文件类型 string
     */
    res.resHeader = function (code, message, type) {
        res.writeHead(code, message, { "Content-Type": type + ';charset=utf-8' });
        res.end(code + ", " + message + ".");
    }

    // 将路径和请求方法转换为小写
    let reqUrl = req.url.toLowerCase();
    let reqMethod = req.method.toLowerCase();

    // 解析get方式提交的数据
    let urlObj = url.parse(reqUrl, true);

    // 根据不同请求的方法和路径做出不同的响应处理，并返回
    if (reqUrl === "/" || reqUrl === "/index" || require === "/index.html" && reqMethod === "get") {
        res.rander(path.join(__dirname, "views", "index.html"));
    } else if (reqUrl === "/submit" || require === "/submit.html" && reqMethod === "get") {
        res.rander(path.join(__dirname, "views", "submit.html"));
    } else if (reqUrl === "/details" || require === "/details.html" && reqMethod === "get") {
        res.rander(path.join(__dirname, "views", "details.html"));
    } else if (reqUrl.indexOf("/add") >= 0 && reqMethod === "get") {
        let list = [];
        // 先读取数据 然后将数据转换为arr 再将数据(arr)push到list里
        fs.readFile(path.join(__dirname, "data", "data-new.json"), "utf8", function (err, data) {
            if (err && err.code != "ENOENT") throw err;
            // (先转换string再转化arr because 第一次可能没数据 则为[] 涉及到深浅拷贝)
            list.push(JSON.parse(JSON.stringify(data || [])));
        })
        // 获取请求过来的数据 将数据push到一个数组中 将这个数组转换为字符串 写入到data-new.json中
        list.push(urlObj.query);
        // 设置定时器 先读再写 不覆盖数据做准备 后续要改！
        setTimeout(function () {
            fs.writeFile(path.join(__dirname, "data", "data-new.json"), JSON.stringify(list), "utf8", function (err) {
                if (err) throw err;
                console.log("写入成功");
                // 跳转新闻列表页面 重定向
                res.statusCode = 302; // 设置响应状态码
                res.statusMessage = "Found"; // 设置响应状态码对应的消息
                res.setHeader("Location", "/"); // 设置跳转路径
                res.end(); // 结束响应
            })
        }, 1000);
    } else if (reqUrl.indexOf("/add") >= 0 && reqMethod === "post") {

    } else if (reqUrl.indexOf("/resources") >= 0 && reqMethod === "get") { // 请求其他文件 如 image css js 等 响应处理
        res.rander(path.join(__dirname, req.url));
    } else {
        res.resHeader(404, 'Not Fount', 'text/html');
    }
}).listen(8080, function () {
    console.log("服务器启动成功，请访问http://localhost:8080");
})