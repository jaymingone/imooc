var express = require('express');/*引入express模块*/
var path = require("path");/*引入路径模块，引入静态资源用到*/
var serveStatic = require('serve-static');/*引入静态资源*/
var bodyParser = require('body-parser');/**/
var mongoose = require('mongoose');/*引入mongoose模块*/
var _ = require('underscore');/*替换老对象的字段用*/
var Movie = require('./models/movies');/*引入导出的movie模型*/
var port = process.env.PORT || 3000;/*设置端口号为3000或环境变量的值*/
var app = express();/*创建WEB服务器实例*/
mongoose.connect('mongodb://127.0.0.1:27017/imooc',function(err){if(err){console.log(err)}else{console.log("sucess")}});/*连接本地数据库*/
app.set('views','./views/pages');/*设置视图的根目录*/
app.set('view engine','jade');/*设置默认的模板引擎*/
// app.use(express.bodyParser());/*提交的表单数据格式化用到*/
app.use(express.static(path.join(__dirname,"public/")));/*具体设置静态资源的路径位置*/
// app.use(serveStatic('bower_components');
app.locals.moment = require('moment');/*引入Moment模块格式化本地时间并赋值给app对象的本地对象调用*/
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.listen(port);/*监听指定的端口*/
console.log('imooc started on port' + port);

// index page 设置路由规则及渲染的页面，和数据的传递
app.get('/',function(req,res){
	Movie.fetch(function(err,movies){
		if(err){
			console.log(err);
		}
		res.render('index',{
		title:"imooc 首页",
		movies:movies
		// movies:[{
		// 	title:"机械战警",
		// 	_id:1,
		// 	poster:"http://r3.ykimg.com/05160000530EEB63675839160D0B79D5"
		// },{
		// 	title:"机械战警",
		// 	_id:2,
		// 	poster:"http://r3.ykimg.com/05160000530EEB63675839160D0B79D5"
		// },{
		// 	title:"机械战警",
		// 	_id:3,
		// 	poster:"http://r3.ykimg.com/05160000530EEB63675839160D0B79D5"
		// },{
		// 	title:"机械战警",
		// 	_id:4,
		// 	poster:"http://r3.ykimg.com/05160000530EEB63675839160D0B79D5"
		// },{
		// 	title:"机械战警",
		// 	_id:5,
		// 	poster:"http://r3.ykimg.com/05160000530EEB63675839160D0B79D5"
		// },{
		// 	title:"机械战警",
		// 	_id:6,
		// 	poster:"http://r3.ykimg.com/05160000530EEB63675839160D0B79D5"
		// }]
		});
	});
});

// detail page 设置路由规则及渲染的页面，和数据的传递
app.get('/movie/:id',function(req,res){
	var id = req.params.id;
	Movie.findById(id,function(err,movie){
		res.render('detail',{
		title:"imooc" + movie.title,
		movie:movie
		// movie:{
		// 	doctor:"何塞 帕迪利亚",
		// 	country:"美国",
		// 	title:"机械战警",
		// 	year:2014,
		// 	poster:"http://r3.ykimg.com/05160000530EEB63675839160D0B79D5",
		// 	language:"英语",
		// 	flash:"http://player.youku.com/player.php/sid/XNjA1Njc0NTUy/v.swf",
		// 	summary:"1214124124234"
		// }
	    });
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
// admin update movie 更新电影
app.get("/admin/update/:id",function(req,res){
	var id = req.params.id;
	if(id){
		Movie.findById(id,function(err,movie){
			res.render('admin',{
				title:"imooc 后台更新页面",
				movie:movie
			})
		})
	}
})
// admin post movie存储POST过来的数据
app.post('/admin/movie/new',function(req,res){
	console.log(req.body);
	console.log(req.body.movie);
	var id = req.body.movie._id;
	var movieObj = req.body.movie;
	var _movie;
	if(id !=="undefined"){
		Movie.findById(id,function(err,movie){
			if(err){
				console.log(err);
			}
			_movie =_.extend(movie,movieObj);
			_movie.save(function(err,movie){
				if(err){
					console.log(err);
				}
				res.redirect('/movie/'+movie._id);
			})
		})
	}else{
		_movie = new Movie({
			doctor:movieObj.doctor,
			title:movieObj.title,
			country:movieObj.country,
			language:movieObj.language,
			year:movieObj.year,
			poster:movieObj.poster,
			summary:movieObj.summary,
			flash:movieObj.flash
		});
		_movie.save(function(err,movie){
			if(err){
					console.log(err);
			}
			res.redirect('/movie/'+movie._id);
		});
	}
});
// list page 设置路由规则及渲染的页面，和数据的传递
app.get('/admin/list',function(req,res){
	Movie.fetch(function(err,movies){
		if(err){
			console.log(err);
		}

		res.render('list',{
			title:"imooc 列表页",
			movies:movies
			// movies:{
			// 	title:"机械战警",
			// 	_id:1,
			// 	doctor:"何塞帕迪利尔",
			// 	country:"美国",
			// 	year:2014,
			// 	poster:"http://r3.ykimg.com/05160000530EEB63675839160D0B79D5",
			// 	language:"英语",
			// 	flash:"http://player.youku.com/player.php/sid/XNjA1Njc0NTUy/v.swf",
			// 	summary:"12342142355151155"
			// }
		})
	})
	
});

// list delete movie
app.delete("/admin/list",function(req,res){
	var id = req.query.id;
	if(id){
		Movie.remove({_id:id},function(err,movie){
			if(err){
				console.log(err);
			}else{
				res.json({success:1});
			};
		})
	}
})