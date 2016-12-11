_ = require('../util/lodash-wrap')

isConstructor = require('./is-constructor')
cloneWithNonEnumerableProperties = require('../util/clone-with-non-enumerable-properties')
wrapWithConstructor = require('./wrap-with-constructor')

module.exports = (fakeThing, realThing) ->
  if isConstructor(realThing)
    wrapWithConstructor(fakeThing)
  else if plainObjectContainingConstructors(realThing)
    wrapThoseConstructors(fakeThing, realThing)
  else
    fakeThing

plainObjectContainingConstructors = (realThing) ->
  _.isPlainObject(realThing) && _.some(realThing, isConstructor)

wrapThoseConstructors = (fakeThing, realThing) ->
  fakeThing = cloneWithNonEnumerableProperties(fakeThing)
  _.each fakeThing, (v, k) ->
    fakeThing[k] = wrapWithConstructor(v) if isConstructor(realThing[k])
  fakeThing
