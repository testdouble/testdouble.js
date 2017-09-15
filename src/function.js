import _ from './util/lodash-wrap'
import calls from './store/calls'
import store from './store'
import stubbings from './store/stubbings'
import imitate from './imitate'

export default (nameOrFunc, __optionalName) =>
  _.isFunction(nameOrFunc)
    ? imitate(nameOrFunc)
    : createTestDoubleNamed(nameOrFunc || __optionalName)

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
