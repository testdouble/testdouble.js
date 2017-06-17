import _ from './util/lodash-wrap'
import calls from './store/calls'
import store from './store'
import stubbings from './store/stubbings'
import gatherProps from './share/gather-props'
import copyProps from './share/copy-props'
import filterFunctions from './share/filter-functions'

export default (nameOrFunc, __optionalName) =>
  _.isFunction(nameOrFunc)
    ? createTestDoubleForFunction(nameOrFunc, __optionalName)
    : createTestDoubleNamed(nameOrFunc || __optionalName)

var createTestDoubleForFunction = (func, optionalName) => {
  const testDouble = createTestDoubleNamed(func.name || optionalName)
  const propNames = gatherProps(func)
  copyProps(func, testDouble, propNames)
  _.each(filterFunctions(func, propNames), funcName => {
    const tdName = `${func.name || optionalName || ''}.${funcName}`
    testDouble[funcName] = createTestDoubleNamed(tdName)
  })
  return testDouble
}

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
