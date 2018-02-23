let testDouble, captor
module.exports = {
  beforeEach () {
    testDouble = td.function()
    captor = td.matchers.captor()
  },
  'when stubbing' () {
    td.when(testDouble(captor.capture())).thenReturn('foobaby')

    const stubbing = testDouble('PANTS!')

    assert._isEqual(captor.value, 'PANTS!')
    assert._isEqual(stubbing, 'foobaby')
  },
  'when stubbing and other matchers do match' () {
    td.when(testDouble(captor.capture(), 'PANTS!')).thenReturn('barbaby')

    const stubbing = testDouble('SHIRTS!', 'PANTS!')

    assert._isEqual(captor.value, 'SHIRTS!')
    assert._isEqual(stubbing, 'barbaby')
  },
  'when stubbing and other matchers do not match' () {
    td.when(testDouble(captor.capture(), 'PANTS!')).thenReturn('barbaby')

    testDouble('SHIRTS!', 'HATS!')

    assert._isEqual(captor.value, undefined)
  },
  'when verifying' () {
    testDouble('SHIRTS!')

    td.verify(testDouble(captor.capture()))

    assert._isEqual(captor.value, 'SHIRTS!')
    assert._isEqual(captor.values, ['SHIRTS!'])
  },
  'when verifying multiple' () {
    testDouble('SHIRTS!')
    testDouble('SHIRTS AGAIN!')

    td.verify(testDouble(captor.capture()))

    assert._isEqual(captor.value, 'SHIRTS AGAIN!')
    assert._isEqual(captor.values, ['SHIRTS!', 'SHIRTS AGAIN!'])
  }
}
