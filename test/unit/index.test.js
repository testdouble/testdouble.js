module.exports = () => {
  if (process.env.CI) return // FIXME: this times out in travis in Node 6. Ugh.

  // Creation
  const func = td.replace('../../src/function').default
  const object = td.replace('../../src/object').default
  const constructor = td.replace('../../src/constructor').default
  const instance = td.replace('../../src/instance').default
  const { default: replace, replaceEsm } = td.replace('../../src/replace')
  const listReplacedModules = td.replace('../../src/list').default
  const imitate = td.replace('../../src/imitate').default
  // Stubbing & Verifying
  const when = td.replace('../../src/when').default
  const verify = td.replace('../../src/verify').default
  const matchers = td.replace('../../src/matchers').default
  const callback = td.replace('../../src/callback').default
  // Misc.
  const explain = td.replace('../../src/explain').default
  const reset = td.replace('../../src/reset').default
  const config = td.replace('../../src/config').default
  const version = td.replace('../../src/version').default
  const quibble = td.replace('quibble')

  const subject = require('../../src')

  assert.deepEqual(subject, {
    func,
    function: func,
    object,
    constructor,
    instance,
    replace,
    replaceEsm,
    listReplacedModules,
    imitate,
    when,
    verify,
    matchers,
    callback,
    explain,
    reset,
    config,
    version,
    quibble
  })
}
