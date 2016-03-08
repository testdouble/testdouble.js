_ = require('lodash')

module.exports = callback = (args...) ->
  args: args
  __testdouble_callback: true
  __matches: _.isFunction

callback.__matches = _.isFunction

callback.isCallback = (obj) ->
  obj == callback || obj?.__testdouble_callback == true
