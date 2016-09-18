_ =
  assign: require('lodash/assign')
  some: require('lodash/some')

calls = require('./store/calls')
stubbings = require('./store/stubbings')
callback = require('./matchers/callback')
log = require('./log')
tdConfig = require('./config')

module.exports = (__userDoesPretendInvocationHere__, config = {}) ->
  thenReturn: (stubbedValues...) ->
    addStubbing(stubbedValues, config, 'thenReturn')
  thenCallback: (stubbedValues...) ->
    addStubbing(stubbedValues, config, 'thenCallback')
  thenDo: (stubbedValues...) ->
    addStubbing(stubbedValues, config, 'thenDo')
  thenThrow: (stubbedValues...) ->
    addStubbing(stubbedValues, config, 'thenThrow')
  thenResolve: (stubbedValues...) ->
    warnIfPromiseless()
    addStubbing(stubbedValues, config, 'thenResolve')
  thenReject: (stubbedValues...) ->
    warnIfPromiseless()
    addStubbing(stubbedValues, config, 'thenReject')

addStubbing = (stubbedValues, config, plan) ->
  _.assign(config, {plan})
  if last = calls.pop()
    stubbings.add(last.testDouble, concatImpliedCallback(last.args, config), stubbedValues, config)
    last.testDouble
  else
    log.error "td.when", """
      No test double invocation call detected for `when()`.

        Usage:
          when(myTestDouble('foo')).thenReturn('bar')
      """

concatImpliedCallback = (args, config) ->
  return args unless config.plan == 'thenCallback'

  if !_.some(args, callback.isCallback)
    args.concat(callback)
  else
    args

warnIfPromiseless = ->
  return if tdConfig().promiseConstructor?
  log.warn "td.when", """
    no promise constructor is set, so this `thenResolve` or `thenReject` stubbing
    will fail if it's satisfied by an invocation on the test double. You can tell
    testdouble.js which promise constructor to use with `td.config`, like so:

      td.config({
        promiseConstructor: require('bluebird')
      })
    """
