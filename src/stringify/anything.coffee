_ = require('lodash')
stringifyObject = require('stringify-object-with-one-liners')

module.exports = (anything) ->
  if _.isString(anything)
    if _.contains(anything, '\n')
      "\"\"\"\n#{anything}\n\"\"\""
    else
      "\"#{anything.replace(new RegExp('"', 'g'), '\\"')}\""
  else
    stringifyObject anything,
      indent: '  '
      singleQuotes: false
      inlineCharacterLimit: 40
