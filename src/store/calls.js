const _ = require('../util/lodash-wrap')
const store = require('./index')
const argsMatch = require('./../args-match')

let callHistory = [] // <-- remember this to pop our DSL of when(<call>)/verify(<call>)
store.onReset(() => { callHistory = [] })

module.exports = {
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

  where (testDouble, args, config) {
    return _.filter(store.for(testDouble).calls, call =>
      argsMatch(args, call.args, config))
  },

  for (testDouble) {
    return store.for(testDouble).calls
  }
}
