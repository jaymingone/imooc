var Index = require('../app/controllers/index');/*首页的控制器文件*/
var Movie = require('../app/controllers/movie');/*引入导出的movie控制器*/
var User = require('../app/controllers/user');/*引入导出的user控制器*/
module.exports=function(app){
	//  会话持久逻辑预处理
	app.use(function(req,res,next){
		var _user = req.session.user;
		app.locals.user = _user;
		next();
	});
	// 首页相关的路由到app/contorller/index.js
	app.get('/',Index.index);
    // 用户操作相关的路由到app/contorller/user.js
	app.post('/user/signup',User.signup);
	app.post('/user/signin',User.signin);
	app.get('/logout',User.logout);
	app.get('/admin/userlist',User.signinRequired,User.adminRequired,User.list);
	app.get('/signin',User.showSignin);
	app.get('/signup',User.showSignup);
	// 电影操作相关的路由到app/contorller/movie.js
	app.get('/movie/:id',Movie.detail);
	app.get('/admin/movie',User.signinRequired,User.adminRequired,Movie.new);
	app.get('/admin/update/:id',User.signinRequired,User.adminRequired,Movie.update);
	app.post('/admin/movie/new',User.signinRequired,User.adminRequired,Movie.save);
	app.get('/admin/list/',User.signinRequired,User.adminRequired,Movie.list);
	app.delete('/admin/list',User.signinRequired,User.adminRequired,Movie.del);
}
	