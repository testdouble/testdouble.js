module.exports = () => {
  if (process.env.CI) return // FIXME: this times out in travis in Node 6. Ugh.

  // Creation
  const func = td.replace('../../src/function').default
  const object = td.replace('../../src/object').default
  const constructor = td.replace('../../src/constructor').default
  const replace = td.replace('../../src/replace').default
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

  const subject = require('../../src')

  assert.deepEqual(subject, {
    func: func,
    function: func,
    object: object,
    constructor: constructor,
    replace: replace,
    when: when,
    verify: verify,
    matchers: matchers,
    callback: callback,
    explain: explain,
    reset: reset,
    config: config,
    version: version
  })
}
