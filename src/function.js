import _ from './wrap/lodash'
import calls from './store/calls'
import store from './store'
import stubbings from './store/stubbings'
import imitate from './imitate'

export default function func (nameOrFunc, __optionalName) {
  const testDouble = _.isFunction(nameOrFunc)
    ? imitate(nameOrFunc)
    : createTestDoubleNamed(nameOrFunc || __optionalName)
  testDouble.reset = () => {
    store.for(testDouble, false)?.stubbings.length && (store.for(testDouble, false).stubbings = [])
    store.for(testDouble, false)?.calls.length && (store.for(testDouble, false).calls = [])
  }
  return testDouble
}

const createTestDoubleNamed = function (name) {
  return _.tap(createTestDoubleFunction(), (testDouble) => {
    const entry = store.for(testDouble, true)
    if (name != null) {
      entry.name = name
      testDouble.toString = () => `[test double for "${name}"]`
    } else {
      testDouble.toString = () => '[test double (unnamed)]'
    }
  })
}

const createTestDoubleFunction = function () {
  return function testDouble (...args) {
    calls.log(testDouble, args, this)
    return stubbings.invoke(testDouble, args, this)
  }
}
