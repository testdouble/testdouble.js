describe('has the testdouble alias still', function(){
  it('prints deprecation', function(){
    var og = console.warn
    console.warn = td.function()

    testdouble.function()

    td.verify(console.warn('DEPRECATED: window.testdouble has been renamed to window.td and will be removed from testdouble@1.0.0'))

    console.warn = og
  })

  it('still works', function(){
    var myTd = testdouble.when(testdouble.function()()).thenReturn(5)

    expect(myTd()).toEqual(5)
  })
})
