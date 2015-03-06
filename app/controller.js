/**
 * Created by ppp on 3/5/2015.
 */
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var model = require('./config.js');
var crypto = require('crypto');
var utility = require('../lib/utility.js')


var validateUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  var query = model.user.find();

  query.where({username: username, password: password});
  query.exec(function(err, result) {
    if (err) {
      //console.log('there was in error in validateUser', err);
      res.redirect('/login');
    } else {
      //console.log(username, 'user was validated');
      utility.createSession(req, res, username);
    }
  })
};
exports.validateUser = validateUser;

var createUser = function(req, res) {
  var entry = new model.user({
    username: req.body.username,
    password: req.body.password
  });
  entry.save(function(err) {
    if (err) {
      //console.log('There was an error, it was: ', err);
      req.redirect('/signup');
    } else {
      //console.log('Able to sign-up');
      res.redirect('/login');
    }
  });
};
exports.createUser = createUser;

var createUrl = function(req, res) {
  var uri = req.body.url;

  if (!utility.isValidUrl(uri)) {
    //console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  utility.getUrlTitle(uri, function(err, title) {
    if (err) {
      //console.log('Error reading URL heading: ', err);
      return res.send(404);

    }
    var shasum = crypto.createHash('sha1');
    shasum.update(uri);
    // shasum.digest('hex').slice(0, 5);
    //console.log(req.body.url, 'url');
    //console.log(req.headers.origin, 'base_url');
    //console.log(shasum, 'code');
    //console.log(req.body.title, 'title');
    var entry = new model.url({
      url: uri,
      base_url: req.headers.origin,
      code: shasum.digest('hex').slice(0, 5),
      title: title
    });
    entry.save(function(err, result) {
      if (err) {
        console.log('There was an error, it was: ', err);
      } else {
        console.log('Able to sign-up');
        res.send(200, result)
      }
    });
  });

};

exports.createUrl = createUrl;

var getUrl = function(req, res) {
  var query = model.url.find();

  query.sort({createdOn: 'desc'});
  query.exec(function(err, result) {
    if (err) {
      //console.log(err);
      res.redirect('/links');
    } else {
      //console.log(result, 'this is the query result');
      res.send(200, result);
    }
  })
};

exports.getUrl = getUrl;

var navToLink = function(req, res) {
  if (req.params && req.params[0]) {
    var query = model.url.find();
    query.where({code: req.params['0']});
    query.exec(function(err, result) {
      if (err) {
        console.log('error', err);
      } else {
        console.log(result[0], 'result');
        if (result[0] && result[0].url) {
          res.redirect(result[0].url);
        }
      }
    });
  }
};

exports.navToLink = navToLink;

exports.createSession = function(req, res, newUser) {
  //console.log('this is the user', newUser);
  return req.session.regenerate(function() {
    //console.log('inside the session.regenerate function', newUser);
    req.session.user = newUser;
    res.redirect('/');
  });
};
//var db = require('../config');
//var bcrypt = require('bcrypt-nodejs');
//var Promise = require('bluebird');
//
//var User = db.Model.extend({
//  tableName: 'users',
//  hasTimestamps: true,
//  initialize: function(){
//    this.on('creating', this.hashPassword);
//  },
//  comparePassword: function(attemptedPassword, callback) {
//    bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
//      callback(isMatch);
//    });
//  },
//  hashPassword: function(){
//    var cipher = Promise.promisify(bcrypt.hash);
//    return cipher(this.get('password'), null, null).bind(this)
//      .then(function(hash) {
//        this.set('password', hash);
//      });
//  }
//});
//
//module.exports = User;

//exports.loginUser = function(req, res) {
//  var username = req.body.username;
//  var password = req.body.password;
//  controller.user(req, res);
//  new User({ username: username })
//    .fetch()
//    .then(function(user) {
//      if (!user) {
//        res.redirect('/login');
//      } else {
//        user.comparePassword(password, function(match) {
//          if (match) {
//            util.createSession(req, res, user);
//          } else {
//            res.redirect('/login');
//          }
//        })
//      }
//    });
//};