rest = require("restler")

class RestApi

  @apiVersion = "24.0"

  @request: (options) ->
    restUrl = (if options.path.substr(0, 6) is "https:" then options.path else options.oauth.instance_url + "/services/data" + options.path)
    console.log "SALESFORCE:RESTAPI:REQUEST ::>  Method: " + options.method
    console.log "SALESFORCE:RESTAPI:REQUEST ::>  Url: " + restUrl + ", data: " + options.data
    console.log "SALESFORCE:RESTAPI:REQUEST ::>  Data: " + options.data
    
    reqOptions =
      method: options.method
      data: options.data
      headers:
        Accept: "application/json"
        Authorization: "OAuth " + options.oauth.access_token
        "Content-Type": "application/json"
    
    req = rest.request restUrl, reqOptions

    req.on "complete", (data, response) =>
      if response.statusCode >= 200 and response.statusCode < 300
        console.log "SALESFORCE:RESTAPI:COMPLETE: " + data
        if data.length is 0
          options.callback()
        else
          options.callback JSON.parse(data)
      else
       # console.log arguments
        options.error data
    
    req.on "error", (data, response) =>
      options.error arguments
      
      
      console.error "SALESFORCE:RESTAPI:ERROR: " + data
      if response.statusCode is 401
        console.log response
        #if options.retry or not options.refresh
         # console.log "Invalid session - we tried!"
          #options.error data, response
        #else
        #console.log "Invalid session - trying a refresh"
        #options.refresh (oauth) ->
          #options.oauth.access_token = oauth.access_token
          #options.retry = true
          #request options
      else
        options.error data, response


  @versions: (oauth,callback, error) ->
    options =
      oauth: oauth
      path: "/"
      callback: callback
      error: error

    RestApi.request options

  @resources: (oauth,callback, error) ->
    options =
      oauth: oauth
      path: "/v" + @apiVersion + "/"
      callback: callback
      error: error

    RestApi.request options

  @describeGlobal: (oauth,callback, error) ->
    options =
      oauth: oauth
      path: "/v" + @apiVersion + "/sobjects/"
      callback: callback
      error: error

    RestApi.request options

  @identity: (oauth,callback, error) ->
    options =
      oauth: oauth
      path: oauth.id
      callback: callback
      error: error

    RestApi.request options

  @metadata: (oauth,data, callback, error) ->
    options =
      oauth: oauth
      path: "/v" + @apiVersion + "/sobjects/" + data.objtype + "/"
      callback: callback
      error: error

    RestApi.request options

  @describe: (oauth,data, callback, error) ->
    options =
      oauth: oauth
      path: "/v" + @apiVersion + "/sobjects/" + data.objtype + "/describe/"
      callback: callback
      error: error

    RestApi.request options

  @create: (oauth,data, callback, error) ->
    options =
      oauth: oauth
      path: "/v" + @apiVersion + "/sobjects/" + data.objtype + "/"
      callback: callback
      error: error
      method: "POST"
      data: JSON.stringify(data.fields)

    RestApi.request options

  @retrieve: (oauth,data, callback, error) ->
    if typeof data.fields is "function"
      error = callback
      callback = data.fields
      data.fields = null
    options =
      oauth: oauth
      path: "/v" + @apiVersion + "/sobjects/" + data.objtype + "/" + data.id + (if data.fields then "?fields=" + data.fields else "")
      callback: callback
      error: error

    RestApi.request options

  @upsert: (oauth,data, callback, error) ->
    options =
      oauth: oauth
      path: "/v" + @apiVersion + "/sobjects/" + data.objtype + "/" + data.externalIdField + "/" + data.externalId
      callback: callback
      error: error
      method: "PATCH"
      data: JSON.stringify(data.fields)

    RestApi.request options

  @update: (oauth, data, callback, error) ->
    options =
      oauth: oauth
      path: "/v" + @apiVersion + "/sobjects/" + data.objtype + "/" + data.id
      callback: callback
      error: error
      method: "PATCH"
      data: JSON.stringify(data.fields)

    RestApi.request options

  @del: (oauth,data, callback, error) ->
    options =
      oauth: oauth
      path: "/v" + @apiVersion + "/sobjects/" + data.objtype + "/" + data.id
      callback: callback
      error: error
      method: "DELETE"

    RestApi.request options

  @search: (oauth,data, callback, error) ->
    options =
      oauth: oauth
      path: "/v" + @apiVersion + "/search/?q=" + escape(data.sosl)
      callback: callback
      error: error

    RestApi.request options

  @query: (oauth,data, callback, error) ->
    options =
      oauth: oauth
      path: "/v" + @apiVersion + "/query/?q=" + escape(data.soql)
      callback: callback
      error: error

    RestApi.request options

  @recordFeed: (oauth,data, callback, error) ->
    options =
      oauth: oauth
      path: "/v" + @apiVersion + "/chatter/feeds/record/" + data.id + "/feed-items"
      callback: callback
      error: error

    RestApi.request options

  @newsFeed: (oauth,data, callback, error) ->
    options =
      oauth: oauth
      path: "/v" + @apiVersion + "/chatter/feeds/news/" + data.id + "/feed-items"
      callback: callback
      error: error

    RestApi.request options

  @profileFeed : (oauth,data, callback, error) ->
    options =
      oauth: oauth
      path: "/v" + @apiVersion + "/chatter/feeds/user-profile/" + data.id + "/feed-items"
      callback: callback
      error: error

    RestApi.request options
    
module.exports = RestApi