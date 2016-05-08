	var _ = require('underscore');/*替换老对象的字段用*/
	var Movie = require('../models/movies');/*引入导出的movie模型*/
	var Comment = require('../models/Comment')
	// detail page 设置路由规则及渲染的页面，和数据的传递
	exports.detail = function(req,res){
		var id = req.params.id;
		Movie.findById(id,function(err,movie){
			Comment
			.find({movie:id})
			.populate('from','name')
			.populate('reply.from reply.to','name')
			.exec(function(err,comments){
				res.render('detail',{
				title:"imooc" + movie.title,
				movie:movie,
				comments:comments
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
		})
	};

	// admin page 设置路由规则及渲染的页面，和数据的传递
	exports.new = function(req,res){
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
	};
	// admin update movie 更新电影
	exports.update = function(req,res){
		var id = req.params.id;
		if(id){
			Movie.findById(id,function(err,movie){
				res.render('admin',{
					title:"imooc 后台更新页面",
					movie:movie
				})
			})
		}
	}
	// admin post movie存储POST过来的数据
	exports.save = function(req,res){
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
	};
	// list page 设置路由规则及渲染的页面，和数据的传递
	exports.list = function(req,res){
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
		
	};

	// list delete movie
	exports.del = function(req,res){
		var id = req.query.id;
		if(id){
			Movie.remove({_id:id},function(err,movie){
				if(err){
					console.log(err);
					res.json({success:0});
				}else{
					res.json({success:1});
				};
			})
		}
	};