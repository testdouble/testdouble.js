let _ = require('../../util/lodash-wrap')
let create = require('../create')

module.exports = create({
  name: 'not',
  matches (matcherArgs, actual) {
    let expected = matcherArgs[0]
    return !_.isEqual(expected, actual)
  }
})
