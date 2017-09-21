const parseCookies = (req, res, next) => {
  var cookieString = req.headers.cookie;
  var cookieObject = {};
  if (cookieString) {
    var cookiesArray = cookieString.split('; ');
    var newCookieArray = [];
    for (let cookie of cookiesArray) {
      newCookieArray.push(cookie.split('='));
    }
    for (let cookie of newCookieArray) {
      cookieObject[cookie[0]] = cookie[1];
    }
  }
  req.cookies = cookieObject;
  next();
};

module.exports = parseCookies;
