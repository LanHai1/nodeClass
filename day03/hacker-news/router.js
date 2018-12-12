// 路由判断模块
let path = require('path');

// 加载业务逻辑处理模块
let handler = require('./handler.js');

module.exports = function (req, res) {
    if (req.url === "/" || req.url === "/index" || req.url === "/index.html" && req.method === "get") {
        handler.index(res);
    } else if (req.url === "/submit" || req.url === "/submit.html" && req.method === "get") {
        handler.html(res, path.join(__dirname, "views", "submit.html"));
    } else if (req.url.indexOf("/item") >= 0 && req.method === "get") {
        handler.item(req, res);
    } else if (req.url.indexOf("/add") >= 0 && req.method === "get") {
        handler.addGet(req, res);
    } else if (req.url.indexOf("/add") >= 0 && req.method === "post") {
        handler.addPost(req, res);
    } else if (req.url.indexOf("/resources") >= 0 && req.method === "get") {
        handler.html(res, path.join(__dirname, req.url));
    } else {
       handler.handerErr(res);
    }
}
