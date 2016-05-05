var mongoose = require('mongoose');/*引入mongoose模块*/
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var CommentSchema = new Schema({/*创建文档集合*/
	movie:{type:ObjectId,ref:'Movie'},
	from:{type:ObjectId,ref:'User'},
	to:{type:ObjectId,ref:'User'},
	content:String,
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
CommentSchema.pre('save',function(next){/*每次存数据之前调用该方法*/
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}
	next();
});

CommentSchema.statics = {/*设置静态方法，实列化后才可使用这些方法*/
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

module.exports = CommentSchema;/*导出模块*/
