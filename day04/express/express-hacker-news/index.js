let express = require('express');
let config = require('./config.js');
let app = express();

// 加载路由模块
let router = require('./router.js');
app.use(router);
app.listen(config.port, function () {
    console.log(`http://localhost:${config.port}`)
})