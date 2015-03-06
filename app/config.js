var Bookshelf = require('bookshelf');
var path = require('path');
var mongoose = require('mongoose');

//var memberNameValidator = [
//  function (val) {
//    return (val.length > 0 && val.toLocaleLowerCase() != 'none')
//  },
//  // Custom error text...
//  'Select a valid member name.' ];
//
//var requiredStringValidator = [
//  function (val) {
//    var testVal = val.trim();
//    return (testVal.length > 0)
//  },
//  // Custom error text...
//  '{PATH} cannot be empty' ];


var urlSchema = mongoose.Schema({
  url: {
    type: String,
    required: true
    //validate: requiredStringValidator
  },
  base_url: {
    type: String,
    required: true
    //validate: requiredStringValidator
  },
  code: {
    type: String,
    required: true
    //validate: requiredStringValidator
  },
  title: {
    type: String,
    required: true
    //validate: requiredStringValidator
  },
  visits: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

var userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
    //validate: memberNameValidator
  },
  password: {
    type: String,
    required: true,
    bcrypt: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.plugin(require('mongoose-bcrypt'));

var User = mongoose.model('User', userSchema);
var Url = mongoose.model('Url', urlSchema);

exports.user = User;
exports.url = Url;
