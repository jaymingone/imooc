var express = require('express');/*引入express模块*/
var port = process.env.PORT || 3000;/*设置端口号为3000或环境变量的值*/
var app = express();/*创建实例*/
app.set('views','./');
app.set('view engine','jade');
app.listen(port);
console.log('imooc started on port' + port);