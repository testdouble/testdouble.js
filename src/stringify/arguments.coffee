_ =
  map: require('lodash/map')

stringifyAnything = require('./anything')

module.exports = (args, joiner = ", ", wrapper = "") ->
  _.map args, (arg) ->
    "#{wrapper}#{stringifyAnything(arg)}#{wrapper}"
  .join(joiner)
