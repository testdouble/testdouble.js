_ = require('lodash')
stringifyAnything = require('./stringify/anything')

DEFAULTS =
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
