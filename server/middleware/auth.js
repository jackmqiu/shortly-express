const models = require('../models');
const Promise = require('bluebird');
const Sessions = models.Sessions; // QUESTION: How does this work? Why does
module.exports.createSession = (req, res, next) => {
  if (req.cookies.shortlyid) {
    console.log(req.cookies);
    res.cookies = req.cookies;
    req.session = {hash: 'hash'};
    next();
  } else {
    Sessions.create().then(function(sessionObj){
      console.log(sessionObj);
      req.session = {hash: 'hash'};
      res.cookies = {'shortlyid': { value: 'cookiehash'}};
      next();
    });
  }
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/
