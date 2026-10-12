const path = require('path')
const { pathToFileURL } = require('url')

// ts-node compiles `import()` in this file to `require()`, which can't load an
// ES module, so build the `import()` where ts-node can't see it
// eslint-disable-next-line no-new-func
const importEsm = new Function('url', 'return import(url)')
const importFromRoot = file =>
  importEsm(pathToFileURL(path.join(__dirname, '../..', file)).href)

// Node-only names that lib/index.mjs re-exports from quibble. The browser build
// stubs quibble out, so it doesn't have them
const NODE_ONLY_EXPORTS = [
  'globalPreload',
  'ignoreCallsFromThisFile',
  'isLoaderLoaded',
  'load',
  'resolve'
]

let browserTd, nodeTd, globalTdUnchanged
module.exports = {
  async beforeAll () {
    const globalTdBefore = globalThis.td
    browserTd = await importFromRoot('dist/testdouble.mjs')
    globalTdUnchanged = globalThis.td === globalTdBefore
    nodeTd = await importFromRoot('lib/index.mjs')
  },
  'exports the same names as the Node ES module entry, minus the Node-only ones' () {
    const expected = Object.keys(nodeTd)
      .filter(name => !NODE_ONLY_EXPORTS.includes(name))
      .sort()

    assert._isEqual(Object.keys(browserTd).sort(), expected)
  },
  'exports no undefined values' () {
    const undefinedExports = Object.keys(browserTd)
      .filter(name => browserTd[name] === undefined)

    assert._isEqual(undefinedExports, [])
  },
  'stubs and verifies' () {
    const fn = browserTd.func('fn')
    browserTd.when(fn('hi')).thenReturn('hello')
    const log = browserTd.function('log')
    log('bye')

    assert._isEqual(fn('hi'), 'hello')
    browserTd.verify(log('bye'))
  },
  'does not set or change globalThis.td' () {
    assert._isEqual(globalTdUnchanged, true)
  }
}
