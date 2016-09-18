_ =
  includes: require('lodash/includes')
  isString: require('lodash/isString')

stringifyObject = require('stringify-object')

module.exports = (anything) ->
  if _.isString(anything)
    if _.includes(anything, '\n')
      "\"\"\"\n#{anything}\n\"\"\""
    else
      "\"#{anything.replace(new RegExp('"', 'g'), '\\"')}\""
  else if anything?.__matches?
    anything.__name
  else
    stringifyObject anything,
      indent: '  '
      singleQuotes: false
      inlineCharacterLimit: 65
