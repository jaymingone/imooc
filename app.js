var express = require('express');/*引入express模块*/
var port = process.env.PORT || 3000;/*设置端口号为3000或环境变量的值*/
var app = express();/*创建WEB服务器实例*/
app.set('views','./views');/*设置视图的根目录*/
app.set('view engine','jade');/*设置默认的模板引擎*/
app.listen(port);/*监听指定的端口*/
console.log('imooc started on port' + port);

// index page 设置路由规则及渲染的页面，和数据的传递
app.get('/',function(req,res){
	res.render('index',{
		title:"imooc 首页"
	})
});

// detail page 设置路由规则及渲染的页面，和数据的传递
app.get('/movie/:id',function(req,res){
	res.render('detail',{
		title:"imooc 详情页"
	})
});

// admin page 设置路由规则及渲染的页面，和数据的传递
app.get('/admin/movie',function(req,res){
	res.render('admin',{
		title:"imooc 后台录入页"
	})
});

// list page 设置路由规则及渲染的页面，和数据的传递
app.get('/admin/list',function(req,res){
	res.render('list',{
		title:"imooc 列表页"
	})
});