let func, when, verify, explain

module.exports = {
  beforeEach: () => {
    func = require('../../../src/function').default
    when = require('../../../src/when').default
    verify = require('../../../src/verify').default
    explain = require('../../../src/explain').default
  },

  'recovers from non-deep-cloneable argument' () {
    const uncloneableThing = createUncloneableThing()
    const double = func()
    when(double(uncloneableThing)).thenReturn('good result')

    const result = double(uncloneableThing)

    assert.equal(result, 'good result')
  },

  'fails if cloneArgs is passed to stub' () {
    const uncloneableThing = createUncloneableThing()
    const double = func()

    assert.throwsMessage(() => {
      when(double(uncloneableThing), { cloneArgs: true }).thenReturn('lol')
    }, 'Failed to deep-clone arguments. Ensure lodash _.cloneDeep works on them')
  },

  'fails if cloneArgs is passed to Verify' () {
    const uncloneableThing = createUncloneableThing()
    const double = func()

    assert.throwsMessage(() => {
      verify(double(uncloneableThing), { cloneArgs: true })
    }, 'Failed to deep-clone arguments. Ensure lodash _.cloneDeep works on them')
  },

  'explain recovers and warns' () {
    const uncloneableThing = createUncloneableThing()
    const double = func()

    double(42, uncloneableThing)

    assert.contains(explain(double).description, 'called with `(42, "[object Object]")` [Cloning argument values failed; displaying current references]')
  }
}

function createUncloneableThing () {
  class WeirdClass {}
  const weirdObject = new WeirdClass()
  const nothing = undefined

  Object.defineProperty(weirdObject, 'dubiousProp', {
    enumerable: true,
    get () {
      return nothing.dubiousProp
    }
  })

  return weirdObject
}
