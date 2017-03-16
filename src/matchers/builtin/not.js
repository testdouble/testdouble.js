const _ = require('../../util/lodash-wrap')
const create = require('../create')

module.exports = create({
  name: 'not',
  matches (matcherArgs, actual) {
    const expected = matcherArgs[0]
    return !_.isEqual(expected, actual)
  }
})
