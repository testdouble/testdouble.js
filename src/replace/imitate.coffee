_ = require('../util/lodash-wrap')

tdConstructor = require('../constructor')
tdObject = require('../object')
tdFunction = require('../function')
log = require('../log')
isConstructor = require('./is-constructor')
stringifyAnything = require('../stringify/anything')

module.exports = (realThing, optionalName) ->
  if isConstructor(realThing)
    tdConstructor(realThing)
  else if _.isPlainObject(realThing)
    tdObject(realThing)
  else if _.isFunction(realThing)
    tdFunction(realThing, optionalName)
  else
    log.error("td.replace", "\"#{optionalName}\" property was found, but test double only knows how to replace functions, constructors, & objects containing functions (its value was #{stringifyAnything(realThing)}).")
