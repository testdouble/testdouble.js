describe('testdouble.js error handling', function () {
  it('fails when we try to use td.replace module replacement', () => {
    expect(() => {
      td.replace('some/module/as/if/this/were/node')
    }).toThrowError(/Sorry, but CommonJS module replacement with td.replace\(\) is only supported under Node\.js runtimes/)
  })
})

