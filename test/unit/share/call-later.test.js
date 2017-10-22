import subject from '../../../src/share/call-later'

let calledWith, func
module.exports = {
  beforeEach: () => {
    calledWith = undefined
    func = (...args) => { calledWith = args }
  },
  'invoke something synchronously': () => {
    subject(func, [42, 'pants'])

    assert.deepEqual(calledWith, [42, 'pants'])
  },
  'invoke something with a defer': (done) => {
    subject(func, [42, 'kaka'], true)

    setTimeout(() => {
      assert.deepEqual(calledWith, [42, 'kaka'])
      done()
    }, 0)
  },
  'invoke something with a delay': (done) => {
    subject(func, [42, 'nope'], true, 10)

    setTimeout(() => {
      assert.deepEqual(calledWith, undefined)
    }, 9)

    setTimeout(() => {
      assert.deepEqual(calledWith, [42, 'nope'])
      done()
    }, 11)
  }
}
