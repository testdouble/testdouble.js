_ = require('lodash')
object = require('../object')
tdFunction = require('../function')
isConstructor = require('./is-constructor')
wrapWithConstructor = require('./wrap-with-constructor')

module.exports = (realThing, optionalName) ->
  if isConstructor(realThing) || _.isPlainObject(realThing)
    object(realThing)
  else
    tdFunction(if realThing?.name then realThing.name else optionalName)
