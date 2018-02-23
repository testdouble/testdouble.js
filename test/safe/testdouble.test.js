module.exports = {
  'where all the functions are' () {
    assert._isEqual(td.when, require('../../src/when').default)
    assert._isEqual(td.verify, require('../../src/verify').default)
    assert._isEqual(td.function, require('../../src/function').default)
    assert._isEqual(td.func, require('../../src/function').default)
    assert._isEqual(td.imitate, require('../../src/imitate').default)
    assert._isEqual(td.object, require('../../src/object').default)
    assert._isEqual(td.constructor, require('../../src/constructor').default)
    assert._isEqual(td.matchers, require('../../src/matchers').default)
    assert._isEqual(td.callback, require('../../src/callback').default)
    assert._isEqual(td.explain, require('../../src/explain').default)
    assert._isEqual(td.reset, require('../../src/reset').default)
    assert._isEqual(td.replace, require('../../src/replace').default)
    assert._isEqual(td.version, require('../../package').version)
  }
}
