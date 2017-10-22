import Stubbing from '../../../src/value/stubbing'

let ensurePromise, callLater, config, subject
let fakePromise, resolver, rejecter, stubbing
module.exports = {
  beforeEach: () => {
    ensurePromise = td.replace('../../../src/log/ensure-promise').default
    callLater = td.replace('../../../src/share/call-later').default
    config = td.replace('../../../src/config').default

    subject = require('../../../src/share/create-promise').default
  },
  'resolve & reject': {
    beforeEach: () => {
      resolver = td.func('resolve')
      rejecter = td.func('reject')
      fakePromise = class FakePromise {
        constructor (handler) {
          handler(resolver, rejecter)
        }
      }
      td.when(config()).thenReturn({promiseConstructor: fakePromise})
      stubbing = new Stubbing(null, null, ['pants'], {
        defer: 'a defer',
        delay: 'a delay'
      })
    },
    'resolve': () => {
      const result = subject(stubbing, true)

      assert(result instanceof fakePromise)
      td.verify(ensurePromise('error'))

      // Phase 2: make sure call later invokes the resolver
      const captor = td.matchers.captor()
      td.verify(callLater(captor.capture(), ['pants'], 'a defer', 'a delay'))

      captor.value()

      td.verify(resolver('pants'))
      assert.equal(td.explain(rejecter).callCount, 0)
    },
    'reject': () => {
      const result = subject(stubbing, false)

      assert(result instanceof fakePromise)
      td.verify(ensurePromise('error'))

      // Phase 2: make sure call later invokes the rejecter
      const captor = td.matchers.captor()
      td.verify(callLater(captor.capture(), ['pants'], 'a defer', 'a delay'))

      captor.value()

      td.verify(rejecter('pants'))
      assert.equal(td.explain(resolver).callCount, 0)
    }
  }
}
