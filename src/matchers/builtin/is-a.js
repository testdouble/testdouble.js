import _ from '../../wrap/lodash'
import create from '../create'
import stringifyArguments from '../../stringify/arguments'

export default create({
  name (matcherArgs) {
    const desc = _.get(matcherArgs[0], 'name') || stringifyArguments(matcherArgs)
    return `isA(${desc})`
  },
  matches (matcherArgs, actual) {
    const type = matcherArgs[0]

    if (type === Number) {
      return _.isNumber(actual)
    } else if (type === String) {
      return _.isString(actual)
    } else if (type === Boolean) {
      return _.isBoolean(actual)
    } else {
      return actual instanceof type
    }
  }
})
