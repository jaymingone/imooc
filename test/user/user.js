// 测试用例
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
function getRandomString(len){
	if(!len)len = 16;
	return crypto.randomBytes(Math.ceil(len/2)).toString('hex');
}
var should = require('should');
var app = require('../../app');
var mongoose = require('mongoose');
// var User = require('../../app/models/user');
var User = mongoose.model('User');
// test
var user;
describe('<Unit Test',function(){
	describe('Model User:',function(){
		before(function(done){
			user ={
				name:getRandomString(),
				password:'password'
			};
			done();
		})
		describe('Before Method save',function(){
			it('should begin without test user',function(done){
				User.find({name:user.name},function(err,users){
					users.should.have.length(0);
					done();
				})
			})
		})
		describe('User save',function(){
			it('should save without problems',function(done){
				
				var _user = new User(user);
				_user.save(function(err){
					should.not.exist(err);
					_user.remove(function(err){
						should.not.exist(err);
						done();
					})
				})
				
			})
			// 密码单元测试
			it('should password be hashed correctly',function(done){
				var password = user.password;
				var _user = new User(user);
				_user.save(function(err){
					should.not.exist(err);
					_user.password.should.not.have.length(0);
					bcrypt.compare(password,_user.password,function(err,isMatch){
						should.not.exist(err);
						isMatch.should.equal(true);
						_user.remove(function(err){
							should.not.exist(err);
							done();
						})
					})
				})
				
			})
			// 用户权限测试
			it('should have default role 0',function(done){
				// var password = user.password;
				var _user = new User(user);
				_user.save(function(err){
					should.not.exist(err);
					_user.role.should.equal(0);
					
						
					_user.remove(function(err){
						should.not.exist(err);
						done();
					})
					
				})
				
			})
			// 相同用户名报错测试
			it('should fail to save an existing user',function(done){
				// var password = user.password;
				var _user1 = new User(user);
				_user1.save(function(err){
					should.not.exist(err);
					var _user2 = new User(user);
					_user2.save(function(err){
						should.exist(err);
						_user1.remove(function(err){
							if(!err){
								_user2.remove(function(err){
									done();
								})
							}
							
						})
					})
					
				});
			})
		})
		after(function(done){
			done();
		})

	})
})