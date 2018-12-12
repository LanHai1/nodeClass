// 模块化
// 模块一（服务模块）：负责启动服务
// 模块二（扩展模块）：负责扩展 req 和 res对象，为req和res对象增加一些更好方便好用的API
// 模块三（路由模块）：负责路由判断
// 模块四（业务模块）：负责处理具体路由的业务代码
// 模块五（数据操作模块）：负责进行数据库操作
// 模块六（配置模块）：负责保存各种项目中用到的配置信息

// 加载扩展模块
let context = require('./context.js');
// 加载路由判断模块
let router = require('./router.js');
// 加载配置模块
let config = require('./config.js');
require('http').createServer(function (req, res) {
    // 模块二
    context(req, res);
    // 模块三
    router(req, res);
}).listen(config.port, function () {
    console.log('服务器启动成功请访问http://localhost:'+config.port);
})
