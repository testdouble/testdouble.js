_ = require('lodash')
store = require('./index')

module.exports =
  add: (testDouble, stubbedValue, args) ->
    store.for(testDouble).stubbings.push({stubbedValue, args})

  get: (testDouble, actualArgs) ->
    _(store.for(testDouble).stubbings).findLast (stubbing) ->
      _.eq(stubbing.args, actualArgs)
    ?.stubbedValue

