// 加载配置模块
let config = require('./config.js');
// 加载扩展模块
let context = require('./context.js');
// 加载路由模块
let router = require('./router.js');
require('http').createServer(function (req, res) {
    context(req, res);
    router(req, res);

}).listen(config.port, function () {
    console.log(`http://localhost:${config.port}`)
})