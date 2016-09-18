_ =
  functions: require('lodash/functions')
  some: require('lodash/some')

module.exports = (thing) ->
  return unless thing?.prototype?
  _.some(_.functions(thing.prototype))
