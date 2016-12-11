_ = require('../util/lodash-wrap')

module.exports = (testDoubleFunctionBag) ->
  constructor = (class TestDoubleConstructor)
  _.each testDoubleFunctionBag, (func, name) ->
    TestDoubleConstructor.prototype[name] = func
  constructor
