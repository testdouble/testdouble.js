imitate = require('./imitate')
_ =
  isFunction: require('lodash/isFunction')
  keys: require('lodash/keysIn')
  reduce: require('lodash/reduce')
  set: require('lodash/set')

module.exports = (realThing) ->
  return {} unless _.isFunction(realThing)
  _.reduce imitatableKeys(realThing), wrapKey(realThing), {}

imitatableKeys = (realThing) ->
  _.keys(realThing).filter (key) ->
    _.isFunction(realThing[key])

wrapKey = (realThing) -> (newThing, key) ->
  _.set(newThing, key, imitate(realThing[key], '.'+key), realThing[key])
