let _ = require('./util/lodash-wrap')
let store = require('./store')
let calls = require('./store/calls')
let stubbings = require('./store/stubbings')
let copyProperties = require('./util/copy-properties')

module.exports = (nameOrFunc, __optionalName) =>
  _.isFunction(nameOrFunc)
    ? createTestDoubleForFunction(nameOrFunc, __optionalName)
    : createTestDoubleNamed(nameOrFunc || __optionalName)

var createTestDoubleForFunction = (func, optionalName) =>
  _.tap(copyProperties(func, createTestDoubleNamed(func.name || optionalName)), testDouble =>
    _.each(_.functions(func), funcName => {
      let tdName = `${func.name || optionalName || ''}.${funcName}`
      testDouble[funcName] = createTestDoubleNamed(tdName)
    })
  )

var createTestDoubleNamed = (name) =>
  _.tap(createTestDoubleFunction(), (testDouble) => {
    let entry = store.for(testDouble, true)
    if (name != null) {
      entry.name = name
      testDouble.toString = () => `[test double for "${name}"]`
    } else {
      testDouble.toString = () => '[test double (unnamed)]'
    }
  })

var createTestDoubleFunction = () =>
  function testDouble (...args) {
    calls.log(testDouble, args, this)
    return stubbings.invoke(testDouble, args)
  }
