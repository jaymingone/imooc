var mongoose = require('mongoose');
var CategorySchmea = require('../schemas/category');
var Category = mongoose.model('Category',CategorySchmea);
module.exports = Category;