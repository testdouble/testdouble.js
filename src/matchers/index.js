let _ = require('../util/lodash-wrap')
let create = require('./create')
let stringifyArguments = require('../stringify/arguments')

module.exports = {
  create,
  captor: require('./captor'),

  isA: create({
    name (matcherArgs) {
      let s = ((matcherArgs[0] != null ? matcherArgs[0].name : undefined) != null)
          ? matcherArgs[0].name
        : stringifyArguments(matcherArgs)
      return `isA(${s})`
    },
    matches (matcherArgs, actual) {
      let type = matcherArgs[0]

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
  }),

  anything: create({
    name: 'anything',
    matches () { return true }
  }),

  contains: create({
    name: 'contains',
    matches (containings, actualArg) {
      if (containings.length === 0) { return false }

      var containsAllSpecified = (containing, actual) =>
        _.every(containing, function (val, key) {
          if (actual == null) { return false }
          if (_.isPlainObject(val)) {
            return containsAllSpecified(val, actual[key])
          } else {
            return _.isEqual(val, actual[key])
          }
        })

      return _.every(containings, function (containing) {
        if (_.isArray(containing)) {
          return _.some(actualArg, actualElement => _.isEqual(actualElement, containing))
        } else if (_.isPlainObject(containing) && _.isPlainObject(actualArg)) {
          return containsAllSpecified(containing, actualArg)
        } else if (_.isRegExp(containing)) {
          return containing.test(actualArg)
        } else {
          return _.includes(actualArg, containing)
        }
      })
    }
  }),

  argThat: create({
    name: 'argThat',
    matches (matcherArgs, actual) {
      let predicate = matcherArgs[0]
      return predicate(actual)
    }
  }),

  not: create({
    name: 'not',
    matches (matcherArgs, actual) {
      let expected = matcherArgs[0]
      return !_.isEqual(expected, actual)
    }
  })
}
