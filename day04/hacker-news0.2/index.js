let config = require('./config.js');
let context = require('./context.js');
let router = require('./router.js');

require('http').createServer(function (req, res) {
    context(req, res);
    router(req, res);
    res.statusCode = 302;
    res.statusMessage = 'Found';
    res.setHeader("Location","/");
    res.end();
}).listen(config.port, function () {
    console.log(`http://localhost:${config.port}`);
})