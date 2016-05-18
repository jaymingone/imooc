// index.js控制和首页进行交互
// index page 设置路由规则及渲染的页面，和数据的传递
var Movie = require('../models/movies');/*引入导出的movie模型*/
var Category = require('../models/category');/*引入导出的catatory模型*/
exports.index=function(req,res){
	// console.log(req.session.user);
	Category
		.find({})
		.populate({path:'movies',select:'title poster',options:{limit:5}})
		.exec(function(err,categories){
			if(err){
				console.log(err);
			}
				// var map = {}
		  //       for (i in categories) {
		  //           map[categories[i]._id] = i
		  //           categories[i].movies=[]
		  //       }
     
	   //      Movie.find({}, function (err, movies) {
	   //          for (i in movies) {
	   //              categories[map[movies[i].category]].movies.push(movies[i])
	   //          }
	   //          res.render('index', {
	   //              title: 'imooc 首页',
	   //              categories: categories
	   //          })
	   //      })
			res.render('index',{
				title:'imooc 首页',
				categories:categories
			})
		})
	// Movie.fetch(function(err,movies){
	// 	if(err){
	// 		console.log(err);
	// 	}
	// 	res.render('index',{
	// 	title:"imooc 首页",
	// 	movies:movies
	// 	// movies:[{
	// 	// 	title:"机械战警",
	// 	// 	_id:1,
	// 	// 	poster:"http://r3.ykimg.com/05160000530EEB63675839160D0B79D5"
	// 	// },{
	// 	// 	title:"机械战警",
	// 	// 	_id:2,
	// 	// 	poster:"http://r3.ykimg.com/05160000530EEB63675839160D0B79D5"
	// 	// },{
	// 	// 	title:"机械战警",
	// 	// 	_id:3,
	// 	// 	poster:"http://r3.ykimg.com/05160000530EEB63675839160D0B79D5"
	// 	// },{
	// 	// 	title:"机械战警",
	// 	// 	_id:4,
	// 	// 	poster:"http://r3.ykimg.com/05160000530EEB63675839160D0B79D5"
	// 	// },{
	// 	// 	title:"机械战警",
	// 	// 	_id:5,
	// 	// 	poster:"http://r3.ykimg.com/05160000530EEB63675839160D0B79D5"
	// 	// },{
	// 	// 	title:"机械战警",
	// 	// 	_id:6,
	// 	// 	poster:"http://r3.ykimg.com/05160000530EEB63675839160D0B79D5"
	// 	// }]
	// 	});
	// });
};

exports.search = function(req,res){
	var catId = req.query.cat;
	var page = parseInt(req.query.p);
	var count = 2;
	var index = page *count;
	Category
		.find({_id:catId})
		.populate({
			path:'movies',
			select:'title poster'
			// options:{limit:2,skip:index}
		})
		.exec(function(err,categories){
			if(err){
				console.log(err);
			}
			var category = categories[0] || {};
			var movies = category.movies || [];
			var results = movies.slice(index,index + count);
			res.render('results',{
				title:"imooc 结果列表页面",
				keyword:category.name,
				currentPage:(page + 1),
				query:'cat=' + catId,
				totalPage:Math.ceil(movies.length/count),
				movies:results
			})
		})
};