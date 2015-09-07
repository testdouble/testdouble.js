_ = require('lodash')

lastTestDoubleInvocation = null

module.exports = (testDouble, args) ->
  lastTestDoubleInvocation = {testDouble, args}

module.exports.recall = -> lastTestDoubleInvocation

