import _ from './util/lodash-wrap'
import calls from './store/calls'
import copyProperties from './util/copy-properties'
import store from './store'
import stubbings from './store/stubbings'

export default (nameOrFunc, __optionalName) =>
  _.isFunction(nameOrFunc)
    ? createTestDoubleForFunction(nameOrFunc, __optionalName)
    : createTestDoubleNamed(nameOrFunc || __optionalName)

var createTestDoubleForFunction = (func, optionalName) =>
  _.tap(copyProperties(func, createTestDoubleNamed(func.name || optionalName)), testDouble =>
    _.each(_.functions(func), funcName => {
      const tdName = `${func.name || optionalName || ''}.${funcName}`
      testDouble[funcName] = createTestDoubleNamed(tdName)
    })
  )

var createTestDoubleNamed = (name) =>
  _.tap(createTestDoubleFunction(), (testDouble) => {
    const entry = store.for(testDouble, true)
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
    return stubbings.invoke(testDouble, args, this)
  }
