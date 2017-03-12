_ = require('../util/lodash-wrap')

stringifyObject = require('stringify-object-es5')

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
      transform: (obj, prop, originalResult) ->
        if obj[prop]?.__matches?
          obj[prop].__name
        else
          originalResult
