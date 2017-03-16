let create = require('../create')

module.exports = create({
  name: 'argThat',
  matches (matcherArgs, actual) {
    let predicate = matcherArgs[0]
    return predicate(actual)
  }
})
