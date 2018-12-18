// 业务模块
let path = require('path');
let express = require('express');

// 静态页面
module.exports.static = function () {
    express.static(path.join(__dirname, "views"));
}
// css/img...
module.exports.resources = function () {
    express.static(path.join(__dirname, "resources"))
}