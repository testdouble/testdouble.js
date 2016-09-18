_ = 
  each: require('lodash/each')
  extend: require('lodash/extend')
  keys: require('lodash/keys')

stringifyAnything = require('./stringify/anything')

DEFAULTS =
  promiseConstructor: global.Promise
  ignoreWarnings: false
  suppressErrors: false

config = _.extend({}, DEFAULTS)

module.exports = (overrides) ->
  ensureOverridesExist(overrides)
  _.extend(config, overrides)

module.exports.reset = ->
  config = _.extend({}, DEFAULTS)

ensureOverridesExist = (overrides) ->
  _.each overrides, (val, key) ->
    if !config.hasOwnProperty(key)
      require('./log').error("td.config", "\"#{key}\" is not a valid configuration key (valid keys are: #{stringifyAnything(_.keys(config))})")
