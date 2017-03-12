_ = require('./lodash-wrap')

module.exports = (original, target) ->
  properties = Object.getOwnPropertyNames(original)

  Object.defineProperties target, _.reduce properties, (memo, p) ->
    if !target.hasOwnProperty(p)
      memo[p] =
        configurable: true
        writable: true
        value: original[p]
        enumerable: original.propertyIsEnumerable(p)
    return memo
  , {}

  return target

