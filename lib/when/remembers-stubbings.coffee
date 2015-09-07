_ = require('lodash')

globalStubbings = []

module.exports = (testDouble, args, stubbedValue) ->
  set(forDouble(testDouble), args, stubbedValue)

module.exports.recall = (testDouble, args) ->
  get(forDouble(testDouble), args)

get = (tdStubbings, args) ->
  stubbingForArgs(tdStubbings, args)?.stubbedValue

set = (tdStubbings, args, stubbedValue) ->
  if stubbing = stubbingForArgs(tdStubbings, args)
    stubbing.stubbedValue = stubbedValue
  else
    tdStubbings.stubbings.push({args, stubbedValue})

forDouble = (testDouble) ->
  return stubbing if stubbing = _.find(globalStubbings, {testDouble})
  _.tap {testDouble, stubbings: []}, (entry) ->
    globalStubbings.push(entry)

stubbingForArgs = (tdStubbings, args) ->
  _.find(tdStubbings.stubbings, (stubbing) ->
    argsMatch(args, stubbing.args))

argsMatch = (args1, args2) ->
  _.eq(args1, args2)
