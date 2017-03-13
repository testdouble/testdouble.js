_ = require('./util/lodash-wrap')
tdFunction = require('./function')
isConstructor = require('./replace/is-constructor')
getAllCustomPrototypalFunctionNames = require('./util/get-all-custom-prototypal-function-names')

module.exports = (typeOrNames) ->
  if isConstructor(typeOrNames)
    fakeConstructorFromType(typeOrNames)
  else
    fakeConstructorFromNames(typeOrNames)

fakeConstructorFromType = (type) ->
  name = type.name || ''
  fauxConstructor = tdFunction("#{name} constructor")
  class TestDoubleConstructor extends type
    constructor: ->
      super
      fauxConstructor(arguments...)

  _.tap TestDoubleConstructor, (fakeType) ->
    # Override "static" functions with instance test doubles
    _.each _.functions(type), (funcName) ->
      fakeType[funcName] = tdFunction("#{name}.#{funcName}")

    # Override prototypal functions with instance test doubles
    _.each getAllCustomPrototypalFunctionNames(type), (funcName) ->
      fakeType.prototype[funcName] = tdFunction("#{name}##{funcName}")

    addToStringMethodsToFakeType(fakeType, name)

fakeConstructorFromNames = (funcNames) ->
  class TestDoubleConstructor

  _.each funcNames, (funcName) ->
    TestDoubleConstructor.prototype[funcName] = tdFunction("##{funcName}")

  addToStringMethodsToFakeType(TestDoubleConstructor)

  return TestDoubleConstructor

addToStringMethodsToFakeType = (fakeType, name) ->
  fakeType.toString = ->
    "[test double constructor#{if name then " for \"#{name}\"" else ''}]"

  fakeType.prototype.toString = ->
    "[test double instance of constructor#{if name then " \"#{name}\"" else ''}]"

