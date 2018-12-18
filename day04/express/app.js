let express = require('express');
let app = express();
let port = 8989;

app.get(/^\/index(\/.+)*/, function (req, res) {
    res.send('你好 express');
})


app.get('/news/:year/:mouth/:day',function(req,res){
    res.send(req.params);
})

// app.all("/allTest", function (req, res, next) {
//     res.send('你好 - > all');
//     next();
// })

app.listen(port, function () {
    console.log(`http://localhost:${port} 启动成功`)
})