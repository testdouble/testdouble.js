const { pathToFileURL } = require('url')
const quibble = require('quibble')

module.exports = {
  async 'listing mocked modules' () {
    assert._isEqual(td.listReplacedModules(), [])

    await td.replaceEsm('./fixtures/honk.mjs')

    assert._isEqual(td.listReplacedModules(), [
      pathToFileURL(quibble.absolutify('./fixtures/honk.mjs', __filename)).href
    ])

    await td.replaceEsm('./fixtures/turn.mjs')

    assert._isEqual(td.listReplacedModules(), [
      pathToFileURL(quibble.absolutify('./fixtures/honk.mjs', __filename)).href,
      pathToFileURL(quibble.absolutify('./fixtures/turn.mjs', __filename)).href
    ])
  },
  async 'listing replaced modules after a reset' () {
    await td.replaceEsm('./fixtures/honk.mjs')

    td.reset()

    assert._isEqual(td.listReplacedModules(), [])
  }
}
