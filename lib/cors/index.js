(function() {
  var Cors;

  Cors = (function() {

    function Cors() {}

    Cors.allowCrossDomain = function(req, res, next) {
      var origin;
      origin = Cors.checkOrigin(req.headers.origin);
      console.log("CORS " + origin);
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
      res.header('Access-Control-Allow-Headers', 'Content-Type');
      res.header("Access-Control-Allow-Headers", "X-Requested-With");
      res.header("Access-Control-Allow-Headers", "Accept");
      if ('OPTIONS' === req.method) {
        return res.send(200);
      } else {
        return next();
      }
    };

    Cors.checkOrigin = function(origin) {
      var allowOrigin;
      allowOrigin = "http://localhost";
      if (!origin) return "*";
      if (origin.indexOf("localhost") > -1) allowOrigin = origin;
      if (origin.indexOf("heroku") > -1) allowOrigin = origin;
      if (origin.indexOf("herokuapp") > -1) allowOrigin = origin;
      return allowOrigin;
    };

    return Cors;

  })();

  module.exports = Cors;

}).call(this);
