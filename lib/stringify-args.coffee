_ = require('lodash')

module.exports = (args) ->
  _(args).map (arg) ->
    try
      JSON.stringify(arg)
    catch e
      "[Circular Object]"
  .join(", ")

