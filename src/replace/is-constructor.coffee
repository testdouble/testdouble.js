_ = require('lodash')

module.exports = (thing) ->
  return unless thing?.prototype?
  _(thing.prototype).functions().any()

