config = require('./config')

module.exports = (func, msg, url) ->
  return if config().ignoreWarnings
  console?.warn?("Warning: testdouble.js - #{func} - #{msg}#{withUrl(url)}")

withUrl = (url) ->
  return "" unless url?
  " (see: #{url} )"
