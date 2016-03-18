_ = require('lodash')
stringifyObject = require('stringify-object')

module.exports = (anything) ->
  string = stringifyObject(anything, indent: '  ', singleQuotes: false)
  if _.isString(anything)
    "\"#{anything}\""
  else if string.length < 40
    string.replace(/\n+\s*/g, '').replace(/,(\w)/g, ', $1')
  else
    string
