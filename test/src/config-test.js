describe('td.config', () => {
  it('sets some ok defaults', () => {
    expect(td.config()).to.deep.equal({
      promiseConstructor: global.Promise,
      ignoreWarnings: false,
      suppressErrors: false
    })
  })

  it('overriding a real property', () => {
    const config = td.config({ignoreWarnings: true})

    expect(config.ignoreWarnings).to.eq(true)
    expect(td.config().ignoreWarnings).to.eq(true)
  })

  it('overriding a non-existent property', () => {
    let error

    try { td.config({wat: 'wat?'}) } catch (e) { error = e }

    expect(error.message).to.eq(
      'Error: testdouble.js - td.config - "wat" is not a valid configuration ' +
      'key (valid keys are: ["promiseConstructor", "ignoreWarnings", ' +
      '"suppressErrors"])')
  })
})
