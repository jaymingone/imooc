	// var _ = require('underscore');/*替换老对象的字段用*/
	var Comment = require('../models/comment');/*引入导出的movie模型*/
	// comment
	exports.save = function(req,res){
		var _comment = req.body.comment;
		var movieId = _comment.movie;
		if(_comment.cid){
			Comment.findById(_comment.cid,function(err,comment){
				var reply = {
					from:_comment.from,
					to:_comment.tid,
					content:_comment.content
				}
				comment.reply.push(reply);
				comment.save(function(err,comment){
					if(err){
						console.log(err);
					}
					res.redirect('/movie/' + movieId);
				})
			})
		}else{
			var comment = new Comment(_comment);
			comment.save(function(err,comment){
				if(err){
					console.log(err);
				}
				res.redirect('/movie/' + movieId);
			})
			
		}
	};
	// list page 设置路由规则及渲染的页面，和数据的传递
	// exports.list = function(req,res){
	// 	Movie.fetch(function(err,movies){
	// 		if(err){
	// 			console.log(err);
	// 		}

	// 		res.render('list',{
	// 			title:"imooc 列表页1",
	// 			movies:movies
	// 			// movies:{
	// 			// 	title:"机械战警",
	// 			// 	_id:1,
	// 			// 	doctor:"何塞帕迪利尔",
	// 			// 	country:"美国",
	// 			// 	year:2014,
	// 			// 	poster:"http://r3.ykimg.com/05160000530EEB63675839160D0B79D5",
	// 			// 	language:"英语",
	// 			// 	flash:"http://player.youku.com/player.php/sid/XNjA1Njc0NTUy/v.swf",
	// 			// 	summary:"12342142355151155"
	// 			// }
	// 		})
	// 	})
		
	// };

	// // list delete movie
	// exports.del = function(req,res){
	// 	var id = req.query.id;
	// 	if(id){
	// 		Movie.remove({_id:id},function(err,movie){
	// 			if(err){
	// 				console.log(err);
	// 				res.json({success:0});
	// 			}else{
	// 				res.json({success:1});
	// 			};
	// 		})
	// 	}
	// };