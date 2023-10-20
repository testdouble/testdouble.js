const { pathToFileURL } = require('url')
const quibble = require('quibble')

module.exports = {
  'listing mocked modules' () {
    assert._isEqual(td.listReplacedModules(), [])

    td.replace('./fixtures/honk')

    assert._isEqual(td.listReplacedModules(), [
      pathToFileURL(quibble.absolutify('./fixtures/honk.js', __filename)).href
    ])

    td.replace('./fixtures/turn')

    assert._isEqual(td.listReplacedModules(), [
      pathToFileURL(quibble.absolutify('./fixtures/honk.js', __filename)).href,
      pathToFileURL(quibble.absolutify('./fixtures/turn.js', __filename)).href
    ])
  },
  'listing replaced modules after a reset' () {
    td.replace('./fixtures/honk')

    td.reset()

    assert._isEqual(td.listReplacedModules(), [])
  }
}
