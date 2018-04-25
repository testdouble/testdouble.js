import _ from '../wrap/lodash'
import stringifyArguments from '../stringify/arguments'

export interface CreatedResult {
  __name?: string
  __matches?: {
    (value: any): boolean
    afterSatisfaction?: Function
  }
}

export interface Created {
  (...matcherArgs): CreatedResult
}

export default (config): Created =>
  (...matcherArgs) =>
    _.tap(({
      __name: nameFor(config, matcherArgs),
      __matches (actualArg) {
        return config.matches(matcherArgs, actualArg)
      }
    }) as CreatedResult, (matcherInstance) => {
      matcherInstance.__matches.afterSatisfaction = (actualArg) => {
        _.invoke(config, 'afterSatisfaction', matcherArgs, actualArg)
      }
      _.invoke(config, 'onCreate', matcherInstance, matcherArgs)
    })

let nameFor = (config, matcherArgs) => {
  if (_.isFunction(config.name)) {
    return config.name(matcherArgs)
  } else if (config.name != null) {
    return `${config.name}(${stringifyArguments(matcherArgs)})`
  } else {
    return `[Matcher for (${stringifyArguments(matcherArgs)})]`
  }
}
