global.expect = chai.expect

global.xThen = ->

global.shouldNotThrow = (func) ->
  func()

afterEach ->
  td.reset()
  td.config.reset()

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
