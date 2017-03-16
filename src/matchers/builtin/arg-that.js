const create = require('../create')

module.exports = create({
  name: 'argThat',
  matches (matcherArgs, actual) {
    const predicate = matcherArgs[0]
    return predicate(actual)
  }
})
