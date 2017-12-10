import _ from '../wrap/lodash'
import argsMatch from '../args-match'
import store from './index'

let callHistory = [] // <-- remember this to pop our DSL of when(<call>)/verify(<call>)
store.onReset(() => { callHistory = [] })

export default {
  log (testDouble, args, context) {
    store.for(testDouble).calls.push({args, context})
    return callHistory.push({testDouble, args, context})
  },

  pop () {
    return _.tap(callHistory.pop(), (call) => {
      if (call != null) {
        store.for(call.testDouble).calls.pop()
      }
    })
  },

  wasInvoked (testDouble, args, config) {
    const matchingInvocationCount = this.where(testDouble, args, config).length
    if (config.times != null) {
      return matchingInvocationCount === config.times
    } else {
      return matchingInvocationCount > 0
    }
  },

  capture (testDouble, args, config) {
    const matchingInvocations = this.where(testDouble, args, config)
    matchingInvocations.forEach(call => {
      args.forEach((arg, key) => {
        arg.__capture && arg.__capture(call.args[key])
      })
    })
  },

  where (testDouble, args, config) {
    return _.filter(store.for(testDouble).calls, call =>
      argsMatch(args, call.args, config))
  },

  for (testDouble) {
    return store.for(testDouble).calls
  }
}
