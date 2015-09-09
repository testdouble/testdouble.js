_ = require('lodash')

module.exports = (args, joiner = ", ", wrapper = "") ->
  _(args).map (arg) ->
    "#{wrapper}#{stringifyArg(arg)}#{wrapper}"
  .join(joiner)

stringifyArg = (arg) ->
  try
    JSON.stringify(arg)
  catch e
    "[Circular Object]"
