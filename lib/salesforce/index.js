(function() {
  var Opf, RestApi, Salesforce, WebLogin;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Opf = require("opf");

  WebLogin = require("./lib/webLogin");

  RestApi = require("./lib/restApi");

  Salesforce = (function() {

    __extends(Salesforce, Opf.Module);

    Salesforce.include(Opf.Events);

    Salesforce.webLogin = function() {
      return new WebLogin();
    };

    function Salesforce(authToken) {
      this.authToken = authToken;
      this.onError = __bind(this.onError, this);
      this.onSuccess = __bind(this.onSuccess, this);
      Opf.log("SALESFORCE::Init with Token " + this.authToken);
    }

    Salesforce.prototype.restApi = function(resource, data) {
      return RestApi[resource](this.authToken, data, this.onSuccess, this.onError);
    };

    Salesforce.prototype.onSuccess = function(data) {
      return this.trigger("success", data);
    };

    Salesforce.prototype.onError = function(data) {
      return this.trigger("error", data);
    };

    return Salesforce;

  })();

  module.exports = Salesforce;

}).call(this);
