http = require('https')
Opf = require("opf")

class WebLogin extends Opf.Module
  @extend Opf.Events

  oauthToken: {}
 # lastLogin: new Date('1970-1-1')
  #sessionLength: 1000*60*60*2

  constructor: ->
    Opf.log "SALESFORCE:WEBLOGIN: Starting Login"
    @executeLogin()

  getAuthToken: ->
    @executeLogin() if !@oauthToken
    
  executeLogin:  ->
    credentials = @getWebCredentials()
    postData   = @getPostData(credentials)
    options = @getPostOptions(credentials,postData)
    
    req = http.request options , @handleLoginResponse
    req.on 'error', @onLoginError
    req.write(postData);
    req.end();

  handleLoginResponse: (res) =>
    Opf.log "SALESFORCE:WEBLOGIN: Login Response: " + res.statusCode
    res.on 'data' , @onLoginSuccess
    res.on 'end', @onLoginComplete

  onLoginSuccess: (data) =>
    newResponse = JSON.parse(data);
    @oauthToken = 
      access_token  : newResponse.access_token
      instance_url  : newResponse.instance_url
      id            : newResponse.id
    
   # @lastLogin: new Date().getTime()
    Opf.log "SALESFORCE:WEBLOGIN: Login Success: " + JSON.stringify(@oauthToken)

  onLoginComplete: (d) ->
    Opf.log "SALESFORCE:WEBLOGIN: Login Complete"
    Opf.trigger "web_login_complete" , @oauthToken
    
    #if(callback) {callback(oauthResponse);}
    
  onLoginError: (e) ->
    Opf.log "SALESFORCE:WEBLOGIN: Login Error: " + e
  
  getPostOptions: (credentials,postData) ->
    host  = @getHostFromUsername(credentials.username)
    options = 
      host   : host
      path   : '/services/oauth2/token'
      method : 'POST'
      headers:
        'host'            : host
        'Content-Length'  : postData.length
        'Content-Type'    : 'application/x-www-form-urlencoded'
        'Accept'          : 'application/jsonrequest'
        'Cache-Control'   : 'no-cache,no-store,must-revalidate'
    options

  getHostFromUsername: (username) ->
    host = if username.indexOf(".test") == (username.length - 5) then "test.salesforce.com" else "login.salesforce.com"
    return host

  getPostData: (c) ->
    post_data = "grant_type=password&client_id=#{c.clientId}&client_secret=#{c.clientSecret}&username=#{c.username}&password=#{c.password}"
  
  getWebCredentials: ->
    credentials =
      username      : process.env.FORCE_DOT_COM_USERNAME
      password     : process.env.FORCE_DOT_COM_PASSWORD
      clientId     : process.env.FORCE_DOT_COM_CLIENT_ID
      clientSecret : process.env.FORCE_DOT_COM_CLIENT_SECRET
      hostname     : process.env.FORCE_DOT_COM_HOSTNAME

module.exports = WebLogin