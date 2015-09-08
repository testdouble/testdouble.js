global.expect = require('chai').expect
global.context = describe
global.requireSubject = (path) -> require("#{process.cwd()}/#{path}")

global.xThen = ->

global.shouldNotThrow = (func) ->
  func()

global.shouldThrow = (func, message) ->
  threw = null
  try
    func()
    threw = false
  catch e
    expect(e.message).to.eq(message) if message?
    threw = true
  expect(threw, "Expected function to throw an error").to.be.true


