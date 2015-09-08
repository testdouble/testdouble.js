_ = require('lodash')

globalStubbings = []

module.exports = (testDouble, args, stubbedValue) ->
  add(forDouble(testDouble), args, stubbedValue)

module.exports.recall = (testDouble, args) ->
  get(forDouble(testDouble), args)

get = (tdStubbings, args) ->
  stubbingForArgs(tdStubbings, args)?.stubbedValue

add = (tdStubbings, args, stubbedValue) ->
  tdStubbings.stubbings.push({args, stubbedValue})

forDouble = (testDouble) ->
  return stubbing if stubbing = _.find(globalStubbings, {testDouble})
  _.tap {testDouble, stubbings: []}, (entry) ->
    globalStubbings.push(entry)

stubbingForArgs = (tdStubbings, args) ->
  _.findLast(tdStubbings.stubbings, (stubbing) ->
    argsMatch(args, stubbing.args))

argsMatch = (args1, args2) ->
  _.eq(args1, args2)
