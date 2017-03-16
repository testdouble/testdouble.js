const _ = require('../../util/lodash-wrap')
const create = require('../create')
const stringifyArguments = require('../../stringify/arguments')

module.exports = create({
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
