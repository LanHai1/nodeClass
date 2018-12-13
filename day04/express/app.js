let express = require('express');
let app = express();
let port = 9999;
// app.get('/index', function (req, res) {
//     res.send('你好 express');
// })

// 用来处理其他文件 如图片 css...
app.use('/index',function(req,res,next){
    res.send(`你好 use express`);
})

app.all("/allTest", function (req, res, next) {
    res.send('你好 - > all');
    next();
})

app.listen(port, function () {
    console.log(`http://localhost:${port} 启动成功`)
})