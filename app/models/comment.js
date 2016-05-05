var mongoose = require('mongoose');
var CommentSchmea = require('../schemas/comment');
var Comment = mongoose.model('Comment',CommentSchmea);
module.exports = Comment;