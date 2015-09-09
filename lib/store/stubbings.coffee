_ = require('lodash')
store = require('./index')
argsMatch = require('./../args-match')

module.exports =
  add: (testDouble, args, stubbedValues) ->
    store.for(testDouble).stubbings.push({stubbedValues, args})

  get: (testDouble, actualArgs) ->
    _(store.for(testDouble).stubbings).findLast (stubbing) ->
      argsMatch(stubbing.args, actualArgs)
    ?.stubbedValues[0]

  for: (testDouble) ->
    store.for(testDouble).stubbings

