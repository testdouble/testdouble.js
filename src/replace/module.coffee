_ =
  each: require('lodash/each')
  isObject: require('lodash/isObject')
  functions: require('lodash/functions')
  some: require('lodash/some')
  transform: require('lodash/transform')

quibble = require('quibble')
imitate = require('./imitate')
isConstructor = require('./is-constructor')
wrapWithConstructor = require('./wrap-with-constructor')
cloneWithNonEnumerableProperties = require('../util/clone-with-non-enumerable-properties')

quibble.ignoreCallsFromThisFile()

module.exports = (path, stub) ->
  return quibble(path, stub) if arguments.length > 1
  realThing = require(quibble.absolutify(path))
  fakeThing = imitate(realThing, path)
  quibble(path, wrapIfNeeded(fakeThing, realThing))
  return fakeThing

wrapIfNeeded = (fakeThing, realThing) ->
  if isConstructor(realThing)
    wrapWithConstructor(fakeThing)
  else if plainObjectContainingConstructors(realThing)
    wrapThoseConstructors(fakeThing, realThing)
  else
    fakeThing

plainObjectContainingConstructors = (realThing) ->
  _.isObject(realThing) && _.some(realThing, isConstructor)

wrapThoseConstructors = (fakeThing, realThing) ->
  fakeThing = cloneWithNonEnumerableProperties(fakeThing)
  _.each fakeThing, (v, k) ->
    fakeThing[k] = wrapWithConstructor(v) if isConstructor(realThing[k])
  fakeThing
