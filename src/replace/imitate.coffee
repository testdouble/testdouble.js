_ = require('lodash')
object = require('../object')
tdFunction = require('../function')
isConstructor = require('./is-constructor')
wrapWithConstructor = require('./wrap-with-constructor')
stringifyAnything = require('../stringify/anything')

module.exports = (realThing, optionalName) ->
  if isConstructor(realThing) || _.isPlainObject(realThing)
    object(realThing)
  else if _.isFunction(realThing)
    tdFunction(if realThing?.name then realThing.name else optionalName)
  else
    throw new Error("td.replace error: \"#{optionalName}\" property was found, but test double only knows how to replace functions, constructors, & objects containing functions (its value was #{stringifyAnything(realThing)}).")
