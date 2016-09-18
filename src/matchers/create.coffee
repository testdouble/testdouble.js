_ =
  isFunction: require('lodash/isFunction')

stringifyArguments = require('../stringify/arguments')

module.exports = (config) ->
  (matcherArgs...) ->
    matcherInstance =
      __name: if _.isFunction(config.name)
          config.name(matcherArgs)
        else if config.name?
          "#{config.name}(#{stringifyArguments(matcherArgs)})"
        else
          "[Matcher for (#{stringifyArguments(matcherArgs)})]"
      __matches: (actualArg) ->
        config.matches(matcherArgs, actualArg)

    config.onCreate?(matcherInstance, matcherArgs)

    return matcherInstance
