import Call from '../../../src/value/call'
import Stubbing from '../../../src/value/stubbing'

let isCallback, callLater, subject
module.exports = {
  beforeEach: () => {
    isCallback = td.replace('../../../src/matchers/is-callback').default
    callLater = td.replace('../../../src/share/call-later').default

    subject = require('../../../src/satisfy/invoke-callbacks').default
  },
  'invokes a basic callback matcher with args': () => {
    // TODO: once matchers & callbacks are ported to value types, replace w/that
    const callbackMatcher = {args: ['pants']}
    const stubbing = new Stubbing('thenBlah', [42, callbackMatcher])
    const realCallback = () => {}
    const call = new Call(null, [42, realCallback])
    td.when(isCallback(callbackMatcher)).thenReturn(true)

    subject(stubbing, call)

    td.verify(callLater(realCallback, ['pants'], undefined, undefined))
  },
  'invokes an arg-less callback matcher marker': () => {
    const callbackMatcher = {}
    const stubbing = new Stubbing('thenBlah', [callbackMatcher, 12])
    const realCallback = () => {}
    const call = new Call(null, [realCallback, 12])
    td.when(isCallback(callbackMatcher)).thenReturn(true)

    subject(stubbing, call)

    td.verify(callLater(realCallback, [], undefined, undefined))
  },
  'invoked a thenCallback': () => {
    const callbackMatcher = {}
    const stubbing = new Stubbing('thenCallback', [callbackMatcher], ['kaka', 2])
    const realCallback = () => {}
    const call = new Call(null, [realCallback])
    td.when(isCallback(callbackMatcher)).thenReturn(true)

    subject(stubbing, call)

    td.verify(callLater(realCallback, ['kaka', 2], undefined, undefined))
  },
  'invokes two callback matchers': () => {
    const callbackMatcher1 = 'a'
    const callbackMatcher2 = 'b'
    const stubbing = new Stubbing('thenBlah', [callbackMatcher1, callbackMatcher2])
    const realCallback1 = () => {}
    const realCallback2 = () => {}
    const call = new Call(null, [realCallback1, realCallback2])
    td.when(isCallback(callbackMatcher1)).thenReturn(true)
    td.when(isCallback(callbackMatcher2)).thenReturn(true)

    subject(stubbing, call)

    td.verify(callLater(realCallback1, [], undefined, undefined))
    td.verify(callLater(realCallback2, [], undefined, undefined))
  },
  'calls nothing if nothing is a callback': () => {
    const stubbing = new Stubbing('thenBlah', ['foo', 'bar'], ['pants'])
    const call = new Call(null, ['foo', 'bar'])

    subject(stubbing, call)

    assert.equal(td.explain(callLater).callCount, 0)
  },
  'passes delay & defer settings to callLater': () => {
    const callbackMatcher = {}
    const stubbing = new Stubbing('thenBlah', [callbackMatcher], [], {delay: 42, defer: true})
    const realCallback = () => {}
    const call = new Call(null, [realCallback])
    td.when(isCallback(callbackMatcher)).thenReturn(true)

    subject(stubbing, call)

    td.verify(callLater(realCallback, [], true, 42))
  }
}
