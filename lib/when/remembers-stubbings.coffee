_ = require('lodash')

stubbings = []

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
    tdStubbings.push({args, stubbedValue})

forDouble = (testDouble) ->
  return stubbing if stubbing = _.find(stubbings, {testDouble})
  _.tap {testDouble, stubbings: []}, (entry) ->
    stubbings.push(entry)

stubbingForArgs = (tdStubbings, args) ->
  _.find(tdStubbings, (s) -> argsMatch(args, s.args))

argsMatch = ->
  true
