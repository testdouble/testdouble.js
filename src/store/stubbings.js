let _ = require('../util/lodash-wrap')

let store = require('./index')
let callsStore = require('./calls')
let argsMatch = require('../args-match')
let callback = require('../matchers/callback')
let config = require('../config')
let log = require('../log')

module.exports = {
  add (testDouble, args, stubbedValues, config) {
    return store.for(testDouble).stubbings.push({callCount: 0, stubbedValues, args, config})
  },

  invoke (testDouble, actualArgs) {
    let stubbing
    if (!(stubbing = stubbingFor(testDouble, actualArgs))) { return }
    return executePlan(stubbing, actualArgs)
  },

  for (testDouble) {
    return store.for(testDouble).stubbings
  }
}

var stubbingFor = (testDouble, actualArgs) =>
  _.findLast(store.for(testDouble).stubbings, stubbing => isSatisfied(stubbing, actualArgs))

var executePlan = function (stubbing, actualArgs) {
  let value = stubbedValueFor(stubbing)
  stubbing.callCount += 1
  invokeCallbackFor(stubbing, actualArgs)
  switch (stubbing.config.plan) {
    case 'thenReturn': return value
    case 'thenDo': return value(...actualArgs)
    case 'thenThrow': throw value
    case 'thenResolve': return createPromise(stubbing, value, true)
    case 'thenReject': return createPromise(stubbing, value, false)
  }
}

var invokeCallbackFor = function (stubbing, actualArgs) {
  if (!_.some(stubbing.args, callback.isCallback)) { return }
  return _.each(stubbing.args, function (expectedArg, i) {
    if (!callback.isCallback(expectedArg)) { return }
    let args = callbackArgs(stubbing, expectedArg)
    return callCallback(stubbing, actualArgs[i], args)
  })
}

var callbackArgs = function (stubbing, expectedArg) {
  if (expectedArg.args != null) {
    return expectedArg.args
  } else if (stubbing.config.plan === 'thenCallback') {
    return stubbing.stubbedValues
  } else {
    return []
  }
}

var callCallback = function (stubbing, callback, args) {
  if (stubbing.config.delay) {
    return _.delay(callback, stubbing.config.delay, ...args)
  } else if (stubbing.config.defer) {
    return _.defer(callback, ...args)
  } else {
    return callback(...args)
  }
}

var createPromise = function (stubbing, value, willResolve) {
  let Promise = config().promiseConstructor
  ensurePromise(Promise)
  return new Promise(function (resolve, reject) {
    return callCallback(stubbing, function () {
      if (willResolve) { return resolve(value) } else { return reject(value) }
    }
    , [value])
  })
}

var stubbedValueFor = function (stubbing) {
  if (stubbing.callCount < stubbing.stubbedValues.length) {
    return stubbing.stubbedValues[stubbing.callCount]
  } else {
    return _.last(stubbing.stubbedValues)
  }
}

var isSatisfied = (stubbing, actualArgs) =>
  argsMatch(stubbing.args, actualArgs, stubbing.config) &&
    hasTimesRemaining(stubbing)

var hasTimesRemaining = function (stubbing) {
  if (stubbing.config.times == null) { return true }
  return stubbing.callCount < stubbing.config.times
}

var ensurePromise = function (Promise) {
  if (Promise != null) { return }
  return log.error('td.when', `\
no promise constructor is set (perhaps this runtime lacks a native Promise
function?), which means this stubbing can't return a promise to your
subject under test, resulting in this error. To resolve the issue, set
a promise constructor with \`td.config\`, like this:

  td.config({
    promiseConstructor: require('bluebird')
  })\
`
  )
}
