import Double from '../../../src/value/double'

let ensurePromise, subject
let double, type, outcomes, callback
module.exports = {
  beforeEach: () => {
    ensurePromise = td.replace('../../../src/log/ensure-promise').default

    subject = require('../../../src/when/chain-stubbing').default

    // Common setup across tests:
    double = Double.create(null, null, null, () => 'a fake')
    callback = (t, o) => { type = t; outcomes = o }
  },
  '.thenReturn': () => {
    const result = subject(double, callback).thenReturn(12, 23)

    assert.equal(result, 'a fake')
    assert.equal(type, 'thenReturn')
    assert.deepEqual(outcomes, [12, 23])
  },
  '.thenCallback': () => {
    const func = () => {}

    const result = subject(double, callback).thenCallback(func)

    assert.equal(result, 'a fake')
    assert.equal(type, 'thenCallback')
    assert.deepEqual(outcomes, [func])
  },
  '.thenDo': () => {
    const func = () => {}

    const result = subject(double, callback).thenDo(func)

    assert.equal(result, 'a fake')
    assert.equal(type, 'thenDo')
    assert.deepEqual(outcomes, [func])
  },
  '.thenThrow': () => {
    const error = new Error('hi')

    const result = subject(double, callback).thenThrow(error)

    assert.equal(result, 'a fake')
    assert.equal(type, 'thenThrow')
    assert.deepEqual(outcomes, [error])
  },
  '.thenResolve': () => {
    const result = subject(double, callback).thenResolve('pants')

    td.verify(ensurePromise('warn'))
    assert.equal(result, 'a fake')
    assert.equal(type, 'thenResolve')
    assert.deepEqual(outcomes, ['pants'])
  },
  '.thenReject': () => {
    const error = new Error('hi')

    const result = subject(double, callback).thenReject(error)

    td.verify(ensurePromise('warn'))
    assert.equal(result, 'a fake')
    assert.equal(type, 'thenReject')
    assert.deepEqual(outcomes, [error])
  }
}
