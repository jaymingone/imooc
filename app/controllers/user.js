// 用户注册模块路由设置
    var User = require('../models/user');/*引入导出的user模型*/
	exports.signup = function(req,res){
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
				console.log(err);/*可用于404，500异常错误*/
			}
			if (user.name!== undefined){/*此处不可用user直接做判断*/
				console.log('用户已存在');
				console.log(typeof user.name);
				return res.redirect('/signin');
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
	};



	// signin登录模块路由设置
	exports.signin = function(req,res){
		var _user = req.body.user;
		var name = _user.name;
		var password = _user.password;
		User.findOne({name:_user.name},function(err,user){
			if(err){
				console.log(err);
			}
			if(!user){
				return res.redirect('/signup');
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
					return res.redirect('/signin');
					console.log('password is not match');
				}
			})
		})
	};
	// 注册页面的跳转
	exports.showSignup = function(req,res){
		res.render('signup',{
			title:'注册页面',
			// users:users
		})
	}
	// 登录页面的跳转
	exports.showSignin = function(req,res){
		res.render('signin',{
			title:'登录页面',
			// users:users
		})
	}

	// logout page router
	exports.logout = function(req,res){
		delete req.session.user;
		// delete app.locals.user;
		res.redirect('/');
	}


	// userlist page 设置路由规则及渲染的页面，和数据的传递
	exports.list = function(req,res){
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
		
	};
