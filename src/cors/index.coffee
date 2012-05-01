class Cors 

  @allowCrossDomain: (req, res, next) ->
    origin =  Cors.checkOrigin(req.headers.origin)
    console.log "CORS " + origin
    res.header('Access-Control-Allow-Origin'  , origin);
    res.header('Access-Control-Allow-Methods' , 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers' , 'Content-Type');
    res.header("Access-Control-Allow-Headers" , "X-Requested-With");
    res.header("Access-Control-Allow-Headers" , "Accept");

    if 'OPTIONS' == req.method
      res.send(200);
    else 
      next();
      
  @checkOrigin: (origin) ->
    allowOrigin = "http://localhost"
    return "*" if !origin
    #TODO USER a REGEX AND LEARN OUT OF PALM OF HAND :(
    allowOrigin = origin if origin.indexOf("localhost") > -1 
    allowOrigin = origin if origin.indexOf("heroku") > -1 
    allowOrigin = origin if origin.indexOf("herokuapp") > -1
    allowOrigin

module.exports = Cors
