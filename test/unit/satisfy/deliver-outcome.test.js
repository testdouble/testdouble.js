import Stubbing from '../../../src/value/stubbing'
import Call from '../../../src/value/call'

let createPromise, subject
module.exports = {
  beforeEach: () => {
    createPromise = td.replace('../../../src/share/create-promise').default

    subject = require('../../../src/satisfy/deliver-outcome').default
  },
  'thenReturn returns current outcome': () => {
    const stubbing = new Stubbing('thenReturn', null, ['pants'])

    const result = subject(stubbing, new Call())

    assert.equal(result, 'pants')
  },
  'thenDo calls current outcome': () => {
    const call = new Call({a: 1}, ['sauce', 'nice'])
    let context, args
    const userFunc = function (...someArgs) {
      context = this
      args = someArgs
      return 'nailed it'
    }
    const stubbing = new Stubbing('thenDo', null, [userFunc])

    const result = subject(stubbing, call)

    assert.equal(result, 'nailed it')
    assert.deepEqual(context, {a: 1})
    assert.deepEqual(args, ['sauce', 'nice'])
  },
  'thenThrow throws current outcome': () => {
    const error = new Error('woah')
    const stubbing = new Stubbing('thenThrow', null, [error])

    assert.throws(() => {
      subject(stubbing, new Call())
    }, /woah/)
  },
  'thenResolve builds a resolving promise': () => {
    const stubbing = new Stubbing('thenResolve')
    td.when(createPromise(stubbing, true)).thenReturn('nice')

    const result = subject(stubbing, new Call())

    assert.equal(result, 'nice')
  },
  'thenReject builds a rejecting promise': () => {
    const stubbing = new Stubbing('thenReject')
    td.when(createPromise(stubbing, false)).thenReturn('a reject')

    const result = subject(stubbing, new Call())

    assert.equal(result, 'a reject')
  }
}
