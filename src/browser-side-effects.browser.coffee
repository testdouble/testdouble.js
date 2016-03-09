_ = require('lodash')

module.exports = (td) ->
  window.testdouble = _.extend({}, td, _(td).functions().transform((result, funcName) ->
    result[funcName] = _.wrap td[funcName], (func, args...) ->
      console?.warn?('DEPRECATED: window.testdouble has been renamed to window.td and will be removed from testdouble@1.0.0')
      func(args...)
  ).value(), {})
