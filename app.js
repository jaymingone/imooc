var express = require('express');/*引入express模块*/
var path = require("path");/*引入路径模块，引入静态资源用到*/
var serveStatic = require('serve-static');/*引入静态资源*/
var bodyParser = require('body-parser');/**/
var mongoose = require('mongoose');/*引入mongoose模块*/
// var _ = require('underscore');/*替换老对象的字段用*/
// var Movie = require('./models/movies');/*引入导出的movie模型*/
// var User = require('./models/user');/*引入导出的user模型*/
var cookieSession = require('cookie-session');/*cookie-session模块*/
var cookieParser = require('cookie-parser');/*session地址解析*/
var logger = require('morgan');/*错误提示用到的中间件*/
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);// var mongoStore = require('connect-mongo')(express);/*mongoDb存储会话用的中间件*/
var dbUrl = 'mongodb://127.0.0.1:27017/imooc'
var port = process.env.PORT || 3000;/*设置端口号为3000或环境变量的值*/
var app = express();/*创建WEB服务器实例*/
mongoose.connect(dbUrl,function(err){if(err){console.log(err)}else{console.log("sucess")}});/*连接本地数据库*/
app.set('views','./app/views/pages');/*设置视图的根目录*/
app.set('view engine','jade');/*设置默认的模板引擎*/
// app.use(express.bodyParser());/*提交的表单数据格式化用到*/
app.use(express.static(path.join(__dirname,"public/")));/*具体设置静态资源的路径位置*/
// app.use(serveStatic('bower_components');
app.locals.moment = require('moment');/*引入Moment模块格式化本地时间并赋值给app对象的本地对象调用*/
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cookieParser());/*session()需用到的中间件*/
app.use(cookieSession({/*Session会话用到的中间件session,用户状态持久化到数据库里*/
	secret:'imooc',
	store:new mongoStore({
		url:dbUrl,
		collection:'sessions'
	}),
	resave:false,
	saveUninitialized:true

}));/*用于判读用户是否为登录状态，保存在内存中*/
app.listen(port);/*监听指定的端口*/
console.log('imooc started on port' + port);

if('development' === app.get('env')){/*如果当前环境为开发环境及本地*/
	app.set('showStackError',true);/*设置为打印错误信息*/
	// app.use(express.logger(':method :url :status'));/*信息的格式*/
	app.use(logger('dev'));
	app.locals.pretty = true;/*讲压缩处理格式化的html代码展开*/
	mongoose.set('debug',true);/*mongoose数据库提示*/
}

require('./configs/router')(app);
