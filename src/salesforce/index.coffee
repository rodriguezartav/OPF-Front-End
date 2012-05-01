Opf = require("opf")

WebLogin = require("./lib/webLogin")
RestApi = require("./lib/restApi")

class Salesforce extends Opf.Module
  @include Opf.Events
  
  @webLogin: ->
    return new WebLogin()
  
  constructor: (@authToken) ->
    Opf.log "SALESFORCE::Init with Token " + @authToken 

  restApi: ( resource , data ) ->
    RestApi[resource](@authToken, data , @onSuccess , @onError)

  onSuccess: (data) =>
    @trigger "success" , data

  onError: (data) =>
    @trigger "error" , data
  

module.exports = Salesforce
