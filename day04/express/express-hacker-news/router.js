// 路由模块
// 加载业务模块
let handler = require('./handler.js');

let express = require('express');
let router = express.Router();

let path = require('path');

// 静态页面
router.use(express.static(path.join(__dirname, "views")));
// img/css...
router.use('/resources', express.static(path.join(__dirname, "resources")));

router.get(/\/add[?].+/,function(req,res){
    console.log(req.query)
    res.send(req.query);
})
module.exports = router;
