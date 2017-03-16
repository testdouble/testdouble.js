let _ = require('../../util/lodash-wrap')
let create = require('../create')

module.exports = create({
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
})
