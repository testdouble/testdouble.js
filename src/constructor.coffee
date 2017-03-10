_ = require('./util/lodash-wrap')
tdFunction = require('./function')
getAllCustomPrototypalFunctionNames = require('./util/get-all-custom-prototypal-function-names')

module.exports = (type) ->
  name = type.name || ''
  class TestDoubleConstructor extends type
    constructor: tdFunction("#{name} constructor")

  _.tap TestDoubleConstructor, (fakeType) ->
    # Override "static" functions with instance test doubles
    _.each _.functions(type), (funcName) ->
      fakeType[funcName] = tdFunction("#{name}.#{funcName}")

    # Override prototypal functions with instance test doubles
    _.each getAllCustomPrototypalFunctionNames(type), (funcName) ->
      fakeType.prototype[funcName] = tdFunction("#{name}##{funcName}")

    fakeType.toString = ->
      "[test double constructor#{if name then " for \"#{name}\"" else ''}]"

    # TODO: add a prototype one too
    #fakeType.toString = ->
      #"[test double constructor#{if name then " for \"#{name}\"" else ''}]"

