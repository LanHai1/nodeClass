// 路由模块
let path = require('path');
// 加载业务模块
let handler = require('./handler.js');
module.exports = function (req, res) {
    if (req.url === '/' || req.url === '/index' || req.url === '/index.html' && req.method === 'get') {
        handler.indexs(req, res);
    } else if (req.url === '/submit' || req.url === '/submit.html' && req.method === 'get') {
        handler.submit(req, res);
    } else if (req.url.startsWith('/item') && req.method === 'get') {
        handler.item(req, res);
    } else if (req.url.startsWith('/add') && req.method === 'get') {
        handler.addGet(req, res);
    } else if (req.url.startsWith('/add') && req.method === 'post') {
        handler.addPost(req, res);
    } else if (req.url.indexOf("/resources") >= 0 && req.method === 'get') {
        handler.resources(req, res);
    } else {
        handler.handerErr(req, res);
    }
}