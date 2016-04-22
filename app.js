var express = require('express');/*引入express模块*/
var path = require("path");/*引入路径模块，引入静态资源用到*/
var serveStatic = require('serve-static');/*引入静态资源*/
var bodyParser = require('body-parser');/**/
var port = process.env.PORT || 3000;/*设置端口号为3000或环境变量的值*/
var app = express();/*创建WEB服务器实例*/
app.set('views','./views/pages');/*设置视图的根目录*/
app.set('view engine','jade');/*设置默认的模板引擎*/
// app.use(express.bodyParser());/*提交的表单数据格式化用到*/
app.use(express.static(path.join(__dirname,"bower_components")));/*具体设置静态资源的路径位置*/
// app.use(serveStatic('bower_components');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.listen(port);/*监听指定的端口*/
console.log('imooc started on port' + port);

// index page 设置路由规则及渲染的页面，和数据的传递
app.get('/',function(req,res){
	res.render('index',{
		title:"imooc 首页",
		movies:[{
			title:"机械战警",
			_id:1,
			poster:"http://r3.ykimg.com/05160000530EEB63675839160D0B79D5"
		},{
			title:"机械战警",
			_id:2,
			poster:"http://r3.ykimg.com/05160000530EEB63675839160D0B79D5"
		},{
			title:"机械战警",
			_id:3,
			poster:"http://r3.ykimg.com/05160000530EEB63675839160D0B79D5"
		},{
			title:"机械战警",
			_id:4,
			poster:"http://r3.ykimg.com/05160000530EEB63675839160D0B79D5"
		},{
			title:"机械战警",
			_id:5,
			poster:"http://r3.ykimg.com/05160000530EEB63675839160D0B79D5"
		},{
			title:"机械战警",
			_id:6,
			poster:"http://r3.ykimg.com/05160000530EEB63675839160D0B79D5"
		}]
	})
});

// detail page 设置路由规则及渲染的页面，和数据的传递
app.get('/movie/:id',function(req,res){
	res.render('detail',{
		title:"imooc 详情页",
		movie:{
			doctor:"何塞 帕迪利亚",
			country:"美国",
			title:"机械战警",
			year:2014,
			poster:"http://r3.ykimg.com/05160000530EEB63675839160D0B79D5",
			language:"英语",
			flash:"http://player.youku.com/player.php/sid/XNJA1NJc0NTUy/v.swf",
			summary:"1214124124234"
		}
	})
});

// admin page 设置路由规则及渲染的页面，和数据的传递
app.get('/admin/movie',function(req,res){
	res.render('admin',{
		title:"imooc 后台录入页",
		movie:{
			title:"",
			doctor:"",
			country:"",
			year:"",
			poster:"",
			flash:"",
			summary:"",
			language:""
		}
	})
});

// list page 设置路由规则及渲染的页面，和数据的传递
app.get('/admin/list',function(req,res){
	res.render('list',{
		title:"imooc 列表页",
		movies:{
			title:"机械战警",
			_id:1,
			doctor:"何塞帕迪利尔",
			country:"美国",
			year:2014,
			poster:"http://r3.ykimg.com/05160000530EEB63675839160D0B79D5",
			language:"英语",
			flash:"http://player.youku.com/player.php/sid/XNJA1NJc0NTUy/v.swf",
			summary:"12342142355151155"
		}
	})
});