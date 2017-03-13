let _ = require('../util/lodash-wrap');

let stringifyArguments = require('../stringify/arguments');

module.exports = config =>
  function(...matcherArgs) {
    let matcherInstance = {
      __name: _.isFunction(config.name) ?
          config.name(matcherArgs)
        : (config.name != null) ?
          `${config.name}(${stringifyArguments(matcherArgs)})`
        :
          `[Matcher for (${stringifyArguments(matcherArgs)})]`,
      __matches(actualArg) {
        return config.matches(matcherArgs, actualArg);
      }
    };

    if (typeof config.onCreate === 'function') {
      config.onCreate(matcherInstance, matcherArgs);
    }

    return matcherInstance;
  }
;
