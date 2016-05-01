var mongoose = require('mongoose');/*引入mongoose模块*/
var bcrype = require('bcrypt-nodejs');
var SALT_WORK_FACTOR = 10;/*密码加盐的强度默认也是10*/
var UserSchema = new mongoose.Schema({/*创建文档集合*/
	name:{
		unique:true,
		type:String,
	},
	password:type:String,
	meta:{
		createAt:{
			type:Date,
			default:Date.now()
		},
		updateAt:{
			type:Date,
			default:Date.now()
		}
	}
})
UserSchema.pre('save',function(next){/*每次存数据之前调用该方法*/
	var user = this;
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}
	// bcrype.genSalt(SALT_WORK_FACTOR,function(err,salt){
	// 	if(err) return next(err);
	// 	bcrype.hash(user.password,salt,function(err,hash){/*拿到加盐后的密码哈希值*/
	// 		if(err) return next(err);
	// 		user.password = hash;
	// 		next();
	// 	});
	// });/*生成后的盐*/
	// next();
	bcrypt.hash(user.password, null, null, function (err, hash){
		if (err) {
			return next(err);
		} 
		user.password = hash;
		next();	
	})
});

UserSchema.statics = {/*设置静态方法，实列化后才可使用这些方法*/
	fetch:function(cb){
		return this
			.find({})
			.sort("meta.updateAt")
			.exec(cb)
	},
	findById:function(id,cb){
		return this
			.findOne({_id:id})
			.exec(cb)
	}
};

module.exports = UserSchema;/*导出模块*/