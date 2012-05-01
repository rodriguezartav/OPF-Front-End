(function() {
  var Opf, WebLogin, http;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  http = require('https');

  Opf = require("opf");

  WebLogin = (function() {

    __extends(WebLogin, Opf.Module);

    WebLogin.extend(Opf.Events);

    WebLogin.prototype.oauthToken = {};

    function WebLogin() {
      this.onLoginSuccess = __bind(this.onLoginSuccess, this);
      this.handleLoginResponse = __bind(this.handleLoginResponse, this);      Opf.log("SALESFORCE:WEBLOGIN: Starting Login");
      this.executeLogin();
    }

    WebLogin.prototype.getAuthToken = function() {
      if (!this.oauthToken) return this.executeLogin();
    };

    WebLogin.prototype.executeLogin = function() {
      var credentials, options, postData, req;
      credentials = this.getWebCredentials();
      postData = this.getPostData(credentials);
      options = this.getPostOptions(credentials, postData);
      req = http.request(options, this.handleLoginResponse);
      req.on('error', this.onLoginError);
      req.write(postData);
      return req.end();
    };

    WebLogin.prototype.handleLoginResponse = function(res) {
      Opf.log("SALESFORCE:WEBLOGIN: Login Response: " + res.statusCode);
      res.on('data', this.onLoginSuccess);
      return res.on('end', this.onLoginComplete);
    };

    WebLogin.prototype.onLoginSuccess = function(data) {
      var newResponse;
      newResponse = JSON.parse(data);
      this.oauthToken = {
        access_token: newResponse.access_token,
        instance_url: newResponse.instance_url,
        id: newResponse.id
      };
      return Opf.log("SALESFORCE:WEBLOGIN: Login Success: " + JSON.stringify(this.oauthToken));
    };

    WebLogin.prototype.onLoginComplete = function(d) {
      Opf.log("SALESFORCE:WEBLOGIN: Login Complete");
      return Opf.trigger("web_login_complete", this.oauthToken);
    };

    WebLogin.prototype.onLoginError = function(e) {
      return Opf.log("SALESFORCE:WEBLOGIN: Login Error: " + e);
    };

    WebLogin.prototype.getPostOptions = function(credentials, postData) {
      var host, options;
      host = this.getHostFromUsername(credentials.username);
      options = {
        host: host,
        path: '/services/oauth2/token',
        method: 'POST',
        headers: {
          'host': host,
          'Content-Length': postData.length,
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/jsonrequest',
          'Cache-Control': 'no-cache,no-store,must-revalidate'
        }
      };
      return options;
    };

    WebLogin.prototype.getHostFromUsername = function(username) {
      var host;
      host = username.indexOf(".test") === (username.length - 5) ? "test.salesforce.com" : "login.salesforce.com";
      return host;
    };

    WebLogin.prototype.getPostData = function(c) {
      var post_data;
      return post_data = "grant_type=password&client_id=" + c.clientId + "&client_secret=" + c.clientSecret + "&username=" + c.username + "&password=" + c.password;
    };

    WebLogin.prototype.getWebCredentials = function() {
      var credentials;
      return credentials = {
        username: process.env.FORCE_DOT_COM_USERNAME,
        password: process.env.FORCE_DOT_COM_PASSWORD,
        clientId: process.env.FORCE_DOT_COM_CLIENT_ID,
        clientSecret: process.env.FORCE_DOT_COM_CLIENT_SECRET,
        hostname: process.env.FORCE_DOT_COM_HOSTNAME
      };
    };

    return WebLogin;

  })();

  module.exports = WebLogin;

}).call(this);
