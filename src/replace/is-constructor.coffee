_ =
  functions: require('lodash/functions')
  isFunction: require('lodash/isFunction')
  some: require('lodash/some')

module.exports = (thing) ->
  return unless thing?.prototype?
  _.some Object.getOwnPropertyNames(thing.prototype), (property) ->
    property != 'constructor' && _.isFunction(thing.prototype[property])
