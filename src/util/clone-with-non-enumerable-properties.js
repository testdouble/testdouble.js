let _ = require('./lodash-wrap')

module.exports = original =>
  _.tap(_.clone(original), clone =>
    Object.defineProperties(clone, _.reduce(nonEnumerableProps(original), function (memo, p) {
      if (!clone.hasOwnProperty(p)) {
        memo[p] = {
          value: original[p],
          enumerable: false
        }
      }
      return memo
    }
    , {})))

var nonEnumerableProps = obj => _.reject(Object.getOwnPropertyNames(obj), obj.propertyIsEnumerable)
