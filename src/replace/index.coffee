_ =
  isString: require('lodash/isString')
replaceModule = require('./module')
replaceProperty = require('./property')

require('quibble')?.ignoreCallsFromThisFile?()

module.exports = (target) ->
  if _.isString(target)
    replaceModule(arguments...)
  else
    replaceProperty(arguments...)
