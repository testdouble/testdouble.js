config = require('./config')

module.exports.warn = (func, msg, url) ->
  return if config().ignoreWarnings
  console?.warn?("Warning: testdouble.js - #{func} - #{msg}#{withUrl(url)}")

module.exports.error = (func, msg, url) ->
  return if config().suppressErrors
  throw new Error("Error: testdouble.js - #{func} - #{msg}#{withUrl(url)}")

withUrl = (url) ->
  return "" unless url?
  " (see: #{url} )"
