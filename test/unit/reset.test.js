let quibble, store, subject
module.exports = {
  beforeEach: () => {
    quibble = td.replace('quibble')
    store = td.replace('../../src/store').default

    subject = require('../../src/reset').default
  },
  'resetting the store and modules': () => {
    subject()

    td.verify(store.reset())
    td.verify(quibble.reset())
  },
  'calling onReset on reset': () => {
    const resetHandler = td.function()

    subject.onReset(() => resetHandler())

    subject()

    td.verify(resetHandler())
  },
  'calling onReset after each reset': () => {
    const resetHandler = td.function()

    subject.onReset(() => resetHandler())

    subject()
    assert.equal(td.explain(resetHandler).callCount, 1)

    subject()
    assert.equal(td.explain(resetHandler).callCount, 2)
  },
  'calling onNextReset on reset': () => {
    const resetHandler = td.function()

    subject.onNextReset(() => resetHandler())

    subject()

    td.verify(resetHandler())
  },
  'calling onNextReset after each reset': () => {
    const resetHandler = td.function()

    subject.onNextReset(() => resetHandler())

    subject()
    assert.equal(td.explain(resetHandler).callCount, 1)

    subject()
    assert.equal(td.explain(resetHandler).callCount, 1)
  }
}
