let subject, when

module.exports = {
  beforeEach: () => {
    subject = require('../../../src/function').default
    when = require('../../../src/when').default
  },
  'recovers from non-deep-cloneable argument': () => {
    class WeirdClass {}
    const weirdObject = new WeirdClass()
    const nothing = undefined

    Object.defineProperty(weirdObject, 'dubiousProp', {
      enumerable: true,
      get () {
        return nothing.dubiousProp
      }
    })

    const stubCallback = subject()
    when(stubCallback(weirdObject)).thenReturn('good result')
    assert.equal(stubCallback(weirdObject), 'good result')
  }
}
