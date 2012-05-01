(function() {
  var RestApi, rest;

  rest = require("restler");

  RestApi = (function() {

    function RestApi() {}

    RestApi.apiVersion = "24.0";

    RestApi.request = function(options) {
      var req, reqOptions, restUrl;
      var _this = this;
      restUrl = (options.path.substr(0, 6) === "https:" ? options.path : options.oauth.instance_url + "/services/data" + options.path);
      console.log("SALESFORCE:RESTAPI:REQUEST ::>  Method: " + options.method);
      console.log("SALESFORCE:RESTAPI:REQUEST ::>  Url: " + restUrl + ", data: " + options.data);
      console.log("SALESFORCE:RESTAPI:REQUEST ::>  Data: " + options.data);
      reqOptions = {
        method: options.method,
        data: options.data,
        headers: {
          Accept: "application/json",
          Authorization: "OAuth " + options.oauth.access_token,
          "Content-Type": "application/json"
        }
      };
      req = rest.request(restUrl, reqOptions);
      req.on("complete", function(data, response) {
        if (response.statusCode >= 200 && response.statusCode < 300) {
          console.log("SALESFORCE:RESTAPI:COMPLETE: " + data);
          if (data.length === 0) {
            return options.callback();
          } else {
            return options.callback(JSON.parse(data));
          }
        } else {
          return options.error(data);
        }
      });
      return req.on("error", function(data, response) {
        options.error(arguments);
        console.error("SALESFORCE:RESTAPI:ERROR: " + data);
        if (response.statusCode === 401) {
          return console.log(response);
        } else {
          return options.error(data, response);
        }
      });
    };

    RestApi.versions = function(oauth, callback, error) {
      var options;
      options = {
        oauth: oauth,
        path: "/",
        callback: callback,
        error: error
      };
      return RestApi.request(options);
    };

    RestApi.resources = function(oauth, callback, error) {
      var options;
      options = {
        oauth: oauth,
        path: "/v" + this.apiVersion + "/",
        callback: callback,
        error: error
      };
      return RestApi.request(options);
    };

    RestApi.describeGlobal = function(oauth, callback, error) {
      var options;
      options = {
        oauth: oauth,
        path: "/v" + this.apiVersion + "/sobjects/",
        callback: callback,
        error: error
      };
      return RestApi.request(options);
    };

    RestApi.identity = function(oauth, callback, error) {
      var options;
      options = {
        oauth: oauth,
        path: oauth.id,
        callback: callback,
        error: error
      };
      return RestApi.request(options);
    };

    RestApi.metadata = function(oauth, data, callback, error) {
      var options;
      options = {
        oauth: oauth,
        path: "/v" + this.apiVersion + "/sobjects/" + data.objtype + "/",
        callback: callback,
        error: error
      };
      return RestApi.request(options);
    };

    RestApi.describe = function(oauth, data, callback, error) {
      var options;
      options = {
        oauth: oauth,
        path: "/v" + this.apiVersion + "/sobjects/" + data.objtype + "/describe/",
        callback: callback,
        error: error
      };
      return RestApi.request(options);
    };

    RestApi.create = function(oauth, data, callback, error) {
      var options;
      options = {
        oauth: oauth,
        path: "/v" + this.apiVersion + "/sobjects/" + data.objtype + "/",
        callback: callback,
        error: error,
        method: "POST",
        data: JSON.stringify(data.fields)
      };
      return RestApi.request(options);
    };

    RestApi.retrieve = function(oauth, data, callback, error) {
      var options;
      if (typeof data.fields === "function") {
        error = callback;
        callback = data.fields;
        data.fields = null;
      }
      options = {
        oauth: oauth,
        path: "/v" + this.apiVersion + "/sobjects/" + data.objtype + "/" + data.id + (data.fields ? "?fields=" + data.fields : ""),
        callback: callback,
        error: error
      };
      return RestApi.request(options);
    };

    RestApi.upsert = function(oauth, data, callback, error) {
      var options;
      options = {
        oauth: oauth,
        path: "/v" + this.apiVersion + "/sobjects/" + data.objtype + "/" + data.externalIdField + "/" + data.externalId,
        callback: callback,
        error: error,
        method: "PATCH",
        data: JSON.stringify(data.fields)
      };
      return RestApi.request(options);
    };

    RestApi.update = function(oauth, data, callback, error) {
      var options;
      options = {
        oauth: oauth,
        path: "/v" + this.apiVersion + "/sobjects/" + data.objtype + "/" + data.id,
        callback: callback,
        error: error,
        method: "PATCH",
        data: JSON.stringify(data.fields)
      };
      return RestApi.request(options);
    };

    RestApi.del = function(oauth, data, callback, error) {
      var options;
      options = {
        oauth: oauth,
        path: "/v" + this.apiVersion + "/sobjects/" + data.objtype + "/" + data.id,
        callback: callback,
        error: error,
        method: "DELETE"
      };
      return RestApi.request(options);
    };

    RestApi.search = function(oauth, data, callback, error) {
      var options;
      options = {
        oauth: oauth,
        path: "/v" + this.apiVersion + "/search/?q=" + escape(data.sosl),
        callback: callback,
        error: error
      };
      return RestApi.request(options);
    };

    RestApi.query = function(oauth, data, callback, error) {
      var options;
      options = {
        oauth: oauth,
        path: "/v" + this.apiVersion + "/query/?q=" + escape(data.soql),
        callback: callback,
        error: error
      };
      return RestApi.request(options);
    };

    RestApi.recordFeed = function(oauth, data, callback, error) {
      var options;
      options = {
        oauth: oauth,
        path: "/v" + this.apiVersion + "/chatter/feeds/record/" + data.id + "/feed-items",
        callback: callback,
        error: error
      };
      return RestApi.request(options);
    };

    RestApi.newsFeed = function(oauth, data, callback, error) {
      var options;
      options = {
        oauth: oauth,
        path: "/v" + this.apiVersion + "/chatter/feeds/news/" + data.id + "/feed-items",
        callback: callback,
        error: error
      };
      return RestApi.request(options);
    };

    RestApi.profileFeed = function(oauth, data, callback, error) {
      var options;
      options = {
        oauth: oauth,
        path: "/v" + this.apiVersion + "/chatter/feeds/user-profile/" + data.id + "/feed-items",
        callback: callback,
        error: error
      };
      return RestApi.request(options);
    };

    return RestApi;

  })();

  module.exports = RestApi;

}).call(this);
