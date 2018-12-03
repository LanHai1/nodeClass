let http = require('http');
let path = require('path');
let url = require('url');
let mime = require('mime');
let fs = require('fs');
let querystring = require('querystring');

http.createServer(function (req, res) {
    res.rander = function (dirFile) {
        fs.readFile(dirFile, function (err, data) {
            if (err) {
                res.writeHead(404, "Not Found", { "Content-Type": 'text/html;charset=utf-8' });
                res.end("Page Not Found.");
                return;
            }
            res.writeHead(200, "OK", { "Content-Type": mime.getType(dirFile) + ';charset=utf-8' });
            res.end(data);
        });
    }
    let reqUrl = req.url.toLowerCase();
    let reqMethod = req.method.toLowerCase();
    let urlObj = url.parse(reqUrl, true);

    if (reqUrl === "/" || reqUrl === "/index" || reqUrl === "/index.html" && reqMethod === "get") {
        res.rander(path.join(__dirname, "views", "index.html"));
    } else if (reqUrl === "/details" || reqUrl === "/details.html" && reqMethod === "get") {
        res.rander(path.join(__dirname, "views", "details.html"));
    } else if (reqUrl === "/submit" || reqUrl === "/submit.html" && reqMethod === "get") {
        res.rander(path.join(__dirname, "views", "submit.html"));
    } else if (reqUrl.indexOf("/add") >= 0 && reqMethod === "get") {
        let list = [];
        let dataUrl = path.join(__dirname, "data", "data-news.json");
        fs.readFile(dataUrl, "utf8", function (err, data) {
            if (err && err.code != "ENOENT") throw err;
            list.push(JSON.parse(JSON.stringify(data || "")));
        })
        list.push(urlObj.query);
        setTimeout(function () {
            fs.writeFile(dataUrl, JSON.stringify(list), "utf8", function (err) {
                if (err) { throw err }
                console.log("写入成功");
                res.statusCode = 302;
                res.statusMessage = "Found";
                res.setHeader("Location", "/");
                res.end();
            })
        }, 1000);
    } else if (reqUrl.indexOf("/add") >= 0 && reqMethod === "post") {
        let list = [];
        let dataUrl = path.join(__dirname, "data", "data-news.json");
        fs.readFile(dataUrl, "utf8", function (err, data) {
            if (err && err.code != "ENOENT") throw err;
            list.push(JSON.parse(JSON.stringify(data || "")));
        })
        let arrPost = [];
        req.on("data", function (chunk) {
            arrPost.push(chunk);
        })
        req.on("end", function () {
            // 将多个buffer类型转换一个buffer
            let postBody = Buffer.concat(arrPost);
            // 将buffer对象转换为字符串
            postBody = postBody.toString("utf-8");
            // 将字符串转换为数组
            // 调用node内置模块 querystring 中的 parse 方法
            postBody = querystring.parse(postBody);
            // 将post请求过来的数据 push 到 list 数组中
            list.push(postBody);
        })
        setTimeout(function () {
            fs.writeFile(dataUrl, JSON.stringify(list), "utf8", function (err) {
                if (err) { throw err }
                console.log("写入成功");
                res.statusCode = 302;
                res.statusMessage = "Found";
                res.setHeader("Location", "/");
                res.end();
            })
        }, 1000);
    } else if (reqUrl.indexOf("/resources") >= 0 && reqMethod === "get") {
        res.rander(path.join(__dirname, reqUrl));
    } else {
        res.writeHead(404, "Not Found", { "Content-Type": 'text/html;charset=utf-8' });
        res.end("Page Not Found.");
    }
}).listen(8080, function () {
    console.log("服务器启动成功请访问:http://localhost:8080");
})


// // 入口函数
// let http = require('http');
// let path = require('path');
// let fs = require('fs');
// let mime = require('mime');
// let url = require('url');

// // 设计路由 
// // “/”或者“/index”则显示新闻列表
// // “/submit”显示添加新闻页面
// // “/item”显示新闻详情
// // “/add”添加一条新闻

// http.createServer(function (req, res) {

//     // 将读取文件函数添加到res对象里面，这样在其他文件中也可以使用这个函数
//     res.rander = function (dirPath) {
//         fs.readFile(dirPath, function (err, data) {
//             if (err) {
//                 res.writeHead(404, 'Not Found', { "Content-Type": 'text/html;charset=utf-8' });
//                 res.end('404, Page Not Found.');
//                 return;
//             }// 抛异常
//             // 给不同的文件设置不同的类型
//             res.writeHead(200, 'OK', { "Content-Type": mime.getType(dirPath) + ';charset=utf-8' });
//             res.end(data);
//         })
//     }

//     // 将请求的路径和请求的方法转小写
//     req.url = req.url.toLowerCase();
//     req.method = req.method.toLowerCase();
//     // 解析get方法提交的数据
//     let urlObj = url.parse(req.url, true);
//     if (req.url === "/" || req.url === "/index" || req.url === "/index.html" && req.method === "get") {
//         res.rander(path.join(__dirname, "views", "index.html"));
//     } else if (req.url === "/submit" || req.url === "/submit.html" && req.method === "get") {
//         res.rander(path.join(__dirname, "views", "submit.html"));
//     } else if (req.url === "/item" || req.url === "/item.html" && req.method === "get") {
//         res.rander(path.join(__dirname, "views", "details.html"));
//     } else if (req.url.indexOf("/add") >= 0 && req.method === "get") {
//         // console.log(urlObj.query.title, urlObj.query.url, urlObj.query.text);
//         // 把用户get提交的新闻数据保存到 data.json 文件中
//         // 为了解决数据覆盖问题 
//         // 首先获取原先data.json的数据 将字符串数据转换成数组 再将新的数据push到数组中 再转换为字符串写入文件中(because fs模块写入文件的数据参数只能是字符串或者buffer)
//         let pathData = path.join(__dirname, "data", "data.json");
//         let list = [];
//         fs.readFile(pathData, "utf8", function (err, data) {
//             if (err && err.code != "ENOENT") throw err; // 这里的判读是因为第一次的时候本来就没有data.json这个文件
//             //json.parse([]) 会报错 所以应该先转换一次字符串
//             list.push(JSON.parse(JSON.stringify(data || []))); // 这里为了第一次读取并且写入数据 所以给了个空数组
//             console.log(data, list);
//             list.push(urlObj.query);
//             fs.writeFile(pathData, JSON.stringify(list), "utf8", function (err) {
//                 if (err) throw err;
//                 console.log("数据保存Over");
//                 // 跳转新闻列表页面,重定向
//                 res.statusCode = 302; // 设置响应状态码
//                 res.statusMessage = 'Found'; // 设置响应状态码对应的消息
//                 res.setHeader("Location", '/'); // 设置跳转路径
//                 res.end(); // 结束响应
//             })
//         })
//     } else if (req.url === "/add" || req.url === "/add.html" && req.method === "post") {

//     } else if (req.url.indexOf("/resources") >= 0 && req.method === "get") { // 为其他文件进行读取响应处理
//         res.rander(path.join(__dirname, req.url));
//     } else {
//         // 设置错误响应状态码å
//         res.writeHead(404, 'Not Found', { "Content-Type": 'text/html;charset=utf-8' });
//         res.end('404, Page Not Found.');
//     }
// }).listen(8080, function () {
//     console.log("服务器启动成功，请访问http://localhost:8080")
// });



