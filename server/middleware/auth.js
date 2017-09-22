const models = require('../models');
const Promise = require('bluebird');
const Sessions = models.Sessions; // QUESTION: How does this work? Why does
module.exports.createSession = (req, res, next) => {
  // if no cookie, user can't be signed in.
  if(!req.cookies.shortlyid){//no cookies
    newSession(req, res, next);
  } else if (req.cookies.shortlyid){//cookies
    Sessions.get({hash: req.cookies.shortlyid})
    .then(function(sessionObj){
      console.log('resolved', JSON.stringify(sessionObj));
      if(sessionObj){//this session is in database
        req.session = {hash: sessionObj.hash};
        if(sessionObj.userId){
          models.Users.get({id: sessionObj.userId}).then(function(userObj){
            req.session.user = {username: userObj.username};
            req.session.userId = userObj.id;
            res.cookie('shortlyid', sessionObj.hash);
            // res.cookies = {shortlyid: {value: sessionObj.hash}};
            next();
          });
        }else{//there's a session but not attached to user
          console.log('theres a session obj: ', sessionObj);
          res.cookie('shortlyid', sessionObj.hash);
          // res.cookies = {shortlyid: {value: sessionObj.hash}};//set res.cookie to current session
          next();
        }
      }else{//new Session, cookie was invalid
        res.cookies = {};//clear cookie
        console.log('theres no session with that cookie', sessionObj);
        newSession(req, res, next);//create session
      }
    }).catch(function(catchObj){
      console.log('failed:  ', catchObj);
    });// validate session..
  }    // good? assign to req/res session cookie.
      // bad? create new session. assign to res/req.
    // check for user.
      // exists? assign user info to req/res (whichver one) session.
      // none? next();

  //
};
  // if (req.cookies.shortlyid && !req.session) {//there are cookies and no session (malicious)
  //   console.log('cookies: ', req.cookies);
  //   res.cookies = req.cookies;
  //   req.session = {hash: req.cookies};
  //   next();
  // } else if (req.cookies.shortlyid && req.session){//if there are cookies and there is a user
  //   Sessions.create().then(function(sessionObj){
  //     return Sessions.get({id: sessionObj.insertId});
  //   })
  //   .then(function(session) {//sets session hash and session userid
  //     console.log('session after promise: ', session);
  //     req.session = {hash: session.hash, userId: session.user};
  //     if(session.userId){
  //       return models.Users.get({id: session.userId});
  //     }
  //   })
  //   .then(function(user){//sets sesstion username
  //     console.log('user after promise: ', user);
  //     if(user){
  //       req.session.user = {username: user.username};
  //     }
  //     res.cookies = {'shortlyid': { value: 'cookiehash'}};
  //     next();
  //   });
  // } else {//no cookies
  //   Sessions.create().then(function(sessionObj){
  //     return Sessions.get({id: sessionObj.insertId});
  //   })
  //   .then(function(session) {//sets session hash and session userid
  //     console.log('session after promise: ', session);
  //     req.session = {hash: session.hash};
  //   });
  // }

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/
function newSession(req, res, next) {
  Sessions.create().then(function(optionsObj){
    return Sessions.get({ id: optionsObj.insertId});
  })// create session. set req cookie, req session, res cookie (obj from cookie parser).
  .then(function(hashObj){
    req.session = {hash: hashObj.hash, userId: hashObj.userId};
    res.cookie('shortlyid', hashObj.hash);
    //res.cookies = {shortlyid: { value: hashObj.hash }};
    next();
  });
}
