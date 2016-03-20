stringifyArguments = require('../stringify/arguments')

module.exports = (config) ->
  (matcherArgs...) ->
    matcherInstance =
      __name: if config.name?
          "#{config.name}(#{stringifyArguments(matcherArgs)})"
        else
          "[Matcher for (#{stringifyArguments(matcherArgs)})]"
      __matches: (actualArg) ->
        config.matches(matcherArgs, actualArg)

    config.onCreate?(matcherInstance, matcherArgs)

    return matcherInstance
