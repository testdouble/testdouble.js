_ =
  functions: require('lodash/functions')
  some: require('lodash/some')

module.exports = (thing) ->
  return unless thing?.prototype?
  _.some Object.getOwnPropertyNames(thing.prototype), (property) ->
    props != 'constructor' && _.isFunction(thing.prototype[property])
