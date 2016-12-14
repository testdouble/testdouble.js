_ = require('../util/lodash-wrap')

module.exports = (thing) ->
  return unless thing?.prototype?
  _.some Object.getOwnPropertyNames(thing.prototype), (property) ->
    property != 'constructor' && _.isFunction(thing.prototype[property])
