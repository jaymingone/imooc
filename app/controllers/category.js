	// var _ = require('underscore');/*替换老对象的字段用*/
	// var Movie = require('../models/movies');/*引入导出的movie模型*/
	// var Comment = require('../models/Comment');
	var Category = require('../models/category');
	// admin page 设置路由规则及渲染的页面，和数据的传递
	exports.new = function(req,res){
		res.render('category_admin',{
			title:"imooc 后台分类录入页",
			category:{}
		})
	};
	// admin post movie存储POST过来的数据
	exports.save = function(req,res){
		var _category = req.body.category;
		var category = new Category(_category)
		category.save(function(err,category){
			if(err){
				console.log(err);
			}
			res.redirect('/admin/category/list')
		})
	};
	// list page 设置路由规则及渲染的页面，和数据的传递
	exports.list = function(req,res){
		Category.fetch(function(err,categories){
			if(err){
				console.log(err);
			}

			res.render('categorylist',{
				title:"imooc 分类列表页",
				categories:categories
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
