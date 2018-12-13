let context = require('./context.js');
let router = require('./router.js');
// 配置模块
let config = require('./config.js');
require('http').createServer(function (req, res) {
    // 扩展模块
    context(req, res);
    // 路由模块
    router(req, res);
    
}).listen(config.port, function () {
    console.log('服务器启动成功请访问http://localhost:' + config.port);
})