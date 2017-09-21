const models = require('../models');
const Promise = require('bluebird');
const Sessions = models.Sessions; // QUESTION: How does this work? Why does
module.exports.createSession = (req, res, next) => {
  if (req.cookies.shortlyid) {
    console.log('cookies: ', req.cookies);
    res.cookies = req.cookies;
    req.session = {hash: req.cookies};
    next();
  } else {
    Sessions.create().then(function(sessionObj){
      return Sessions.get({id: sessionObj.insertId});
    })
    .then(function(session) {
      console.log('session after promise: ', session);
      req.session = {hash: session.hash, userId: session.user};
      if(session.userId){
        return models.Users.get({id: session.userId});
      }
    })
    .then(function(user){
      console.log('user after promise: ', user);
      if(user){
        req.session.user = {username: user.username};
      }
      res.cookies = {'shortlyid': { value: 'cookiehash'}};
      next();
    });
  }
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/
