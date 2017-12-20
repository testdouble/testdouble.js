import _ from '../wrap/lodash'
import stringifyArguments from '../stringify/arguments'

export default config =>
  (...matcherArgs) =>
    _.tap({
      __name: nameFor(config, matcherArgs),
      __matches (actualArg) {
        return config.matches(matcherArgs, actualArg)
      }
    }, (matcherInstance) => {
      matcherInstance.__matches.afterSatisfaction = (actualArg) => {
        _.invoke(config, 'afterSatisfaction', matcherArgs, actualArg)
      }
      _.invoke(config, 'onCreate', matcherInstance, matcherArgs)
    })

var nameFor = (config, matcherArgs) => {
  if (_.isFunction(config.name)) {
    return config.name(matcherArgs)
  } else if (config.name != null) {
    return `${config.name}(${stringifyArguments(matcherArgs)})`
  } else {
    return `[Matcher for (${stringifyArguments(matcherArgs)})]`
  }
}
