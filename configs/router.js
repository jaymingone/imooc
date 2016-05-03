var _ = require('underscore');/*替换老对象的字段用*/
var Movie = require('../models/movies');/*引入导出的movie模型*/
var User = require('../models/user');/*引入导出的user模型*/
module.exports=function(app){
	//  会话持久逻辑预处理
	app.use(function(req,res,next){
		var _user = req.session.user;
		if(_user){
			app.locals.user = _user;
		}
		return next();
	})
	// index page 设置路由规则及渲染的页面，和数据的传递
	app.get('/',function(req,res){
		console.log(req.session.user);
		
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
		// user.save(function(err,user){
		// 	if(err){
		// 		console.log(err)
		// 	}
		// 	res.redirect('/');
		// })
		User.find({name: _user.name},function(err,user){/*避免注册用户名重复*/

			if (err){
				console.log(err);
			}
			if (user){
				console.log('用户已存在');
				console.log(1)
				return res.redirect('/');

			}
			else{
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
		res.redirect('/');
	})


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
}