var express = require('express');/*引入express模块*/
var path = require("path");/*引入路径模块，引入静态资源用到*/
var serveStatic = require('serve-static');/*引入静态资源*/
var bodyParser = require('body-parser');/**/
var mongoose = require('mongoose');/*引入mongoose模块*/
var _ = require('underscore');/*替换老对象的字段用*/
var Movie = require('./models/movies');/*引入导出的movie模型*/
var User = require('./models/user');/*引入导出的user模型*/
var cookieSession = require('cookie-session');/*cookie-session模块*/
var cookieParser = require('cookie-parser');/*session地址解析*/
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);// var mongoStore = require('connect-mongo')(express);/*mongoDb存储会话用的中间件*/
var dbUrl = 'mongodb://127.0.0.1:27017/imooc'
var port = process.env.PORT || 3000;/*设置端口号为3000或环境变量的值*/
var app = express();/*创建WEB服务器实例*/
mongoose.connect(dbUrl,function(err){if(err){console.log(err)}else{console.log("sucess")}});/*连接本地数据库*/
app.set('views','./views/pages');/*设置视图的根目录*/
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

// index page 设置路由规则及渲染的页面，和数据的传递
app.get('/',function(req,res){
	console.log(req.session.user);
	var _user = req.session.user;
	if(_user){
		app.locals.user = _user;
	}
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
			title:"imooc 列表页1",
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
});
// 用户注册模块路由设置
app.post('/user/signup',function(req,res){
	var _user = req.body.user;
	// var _user = req.param('user');
	// var user = new User(_user);
	User.find({name:_user.name},function(err,user){/*避免注册用户名重复*/
		if(err){
			console.log(err);
		}
		if(user){
			console.log('用户已存在');
			return res.redirect('/');
		}else{
			console.log('用户不存在并创建新用户');
			var user = new User(_user);
			user.save(function(err,user){
			if(err){
				console.log(err);
			}
			console.log(user);
			res.redirect('/admin/userlist');
		    });
		}
	});
	
	/*console.log(_user);*/
});


// userlist page 设置路由规则及渲染的页面，和数据的传递
app.get('/admin/userlist',function(req,res){
	User.fetch(function(err,users){
		if(err){
			console.log(err);
		}

		res.render('userlist',{
			title:"imooc 用户列表页",
			users:users
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

// signin登录模块路由设置
app.post('/user/signin',function(req,res){
	var _user = req.body.user;
	var name = _user.name;
	var password = _user.password;
	User.findOne({name:_user.name},function(err,user){
		if(err){
			console.log(err);
		}
		if(!user){
			return res.redirect('/');
		}
		user.comparePassword(password,function(err,isMatch){
			if(err){
				console.log(err);
			}
			if(isMatch){
				console.log('PASSWORD IS MATCH!')
				req.session.user = user;
				return res.redirect('/');
			}else{
				console.log('password is not match');
			}
		})
	})
});

// logout page router
app.get('/logout',function(req,res){
	delete req.session.user;
	delete app.locals.user;
	req.redirect('/');
})