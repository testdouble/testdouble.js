describe('td.config', () => {
  it('sets some ok defaults', () => {
    expect(td.config()).to.deep.equal({
      ignoreWarnings: false,
      promiseConstructor: global.Promise,
      suppressErrors: false
    })
  })

  it('overriding a real property', () => {
    const config = td.config({ignoreWarnings: true})

    expect(config.ignoreWarnings).to.eq(true)
    expect(td.config().ignoreWarnings).to.eq(true)
  })

  it('overriding a deprecated property', () => {
    const ogWarn = console.warn
    const warnings = []
    console.warn = function (warning) { warnings.push(warning) }

    const config = td.config({extendWhenReplacingConstructors: true})

    expect(config.extendWhenReplacingConstructors).to.eq(undefined)
    expect(td.config().extendWhenReplacingConstructors).to.eq(undefined)
    expect(warnings[0]).to.eq(
      'Warning: testdouble.js - td.config - "extendWhenReplacingConstructors" is no longer a valid configuration key. Remove it from your calls to td.config() or it may throw an error in the future. For more information, try hunting around our GitHub repo for it:\n\n  https://github.com/testdouble/testdouble.js/search?q=extendWhenReplacingConstructors'
    )

    console.warn = ogWarn
  })

  it('overriding a non-existent property', () => {
    let error

    try { td.config({wat: 'wat?'}) } catch (e) { error = e }

    expect(error.message).to.eq(
      'Error: testdouble.js - td.config - "wat" is not a valid configuration ' +
      'key (valid keys are: ["ignoreWarnings", ' +
      '"promiseConstructor", "suppressErrors"])')
  })
})
