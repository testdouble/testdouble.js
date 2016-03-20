_ = require('lodash')
stringifyAnything = require('./anything')

module.exports = (args, joiner = ", ", wrapper = "") ->
  _(args).map (arg) ->
    "#{wrapper}#{stringifyAnything(arg)}#{wrapper}"
  .join(joiner)
