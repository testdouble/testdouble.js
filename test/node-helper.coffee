global.testdouble = require('./../lib/testdouble')
global._ = require('lodash')
global.expect = require('chai').expect

# Stuff to pull into the common-helper
global.context = describe
global.requireSubject = (path) ->
  return testdouble unless path?
  [lib, pathComponents...] = path.split('/')
  _.reduce pathComponents, (memo, nextProp) ->
    console.log "HEYY", testdouble, "memo:", memo, "next:", nextProp
    memo[nextProp]
  , testdouble

global.xThen = ->

global.shouldNotThrow = (func) ->
  func()

global.shouldThrow = (func, expectedMessage) ->
  threw = null
  actualMessage = null
  try
    func()
    threw = false
  catch e
    actualMessage = e.message
    expect(actualMessage).to.eq(expectedMessage) if expectedMessage?
    threw = true
  expect(threw, "Expected function to throw an error").to.be.true
  actualMessage

