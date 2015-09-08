_ = require('lodash')
store = require('./index')
argsMatch = require('./../args-match')

module.exports =
  add: (testDouble, stubbedValue, args) ->
    store.for(testDouble).stubbings.push({stubbedValue, args})

  get: (testDouble, actualArgs) ->
    _(store.for(testDouble).stubbings).findLast (stubbing) ->
      argsMatch(stubbing.args, actualArgs)
    ?.stubbedValue

  for: (testDouble) ->
    store.for(testDouble).stubbings

