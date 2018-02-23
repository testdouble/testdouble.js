module.exports = {
  'sets some ok defaults' () {
    assert.deepEqual(td.config(), {
      ignoreWarnings: false,
      promiseConstructor: global.Promise,
      suppressErrors: false
    })
  },
  'overriding a real property' () {
    const config = td.config({ignoreWarnings: true})

    assert._isEqual(config.ignoreWarnings, true)
    assert._isEqual(config.ignoreWarnings, true)
    assert._isEqual(td.config().ignoreWarnings, true)
  },
  'overriding a deprecated property' () {
    const ogWarn = console.warn
    const warnings = []
    console.warn = function (warning) { warnings.push(warning) }

    const config = td.config({extendWhenReplacingConstructors: true})

    assert._isEqual(config.extendWhenReplacingConstructors, undefined)
    assert._isEqual(td.config().extendWhenReplacingConstructors, undefined)
    assert._isEqual(warnings[0],
      'Warning: testdouble.js - td.config - "extendWhenReplacingConstructors" is no longer a valid configuration key. Remove it from your calls to td.config() or it may throw an error in the future. For more information, try hunting around our GitHub repo for it:\n\n  https://github.com/testdouble/testdouble.js/search?q=extendWhenReplacingConstructors'
    )

    console.warn = ogWarn
  },
  'overriding a non-existent property' () {
    let error

    try { td.config({wat: 'wat?'}) } catch (e) { error = e }

    assert._isEqual(error.message,
      'Error: testdouble.js - td.config - "wat" is not a valid configuration ' +
      'key (valid keys are: ["ignoreWarnings", ' +
      '"promiseConstructor", "suppressErrors"])')
  }
}
