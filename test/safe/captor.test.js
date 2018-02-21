let testDouble, captor
module.exports = {
  beforeEach: () => {
    testDouble = td.function()
    captor = td.matchers.captor()
  },
  'when stubbing': () => {
    td.when(testDouble(captor.capture())).thenReturn('foobaby')

    const stubbing = testDouble('PANTS!')

    assert.equal(captor.value, 'PANTS!')
    assert.equal(stubbing, 'foobaby')
  },
  'when stubbing and other matchers do match': () => {
    td.when(testDouble(captor.capture(), 'PANTS!')).thenReturn('barbaby')

    const stubbing = testDouble('SHIRTS!', 'PANTS!')

    assert.equal(captor.value, 'SHIRTS!')
    assert.equal(stubbing, 'barbaby')
  },
  'when stubbing and other matchers do not match': () => {
    td.when(testDouble(captor.capture(), 'PANTS!')).thenReturn('barbaby')

    const stubbing = testDouble('SHIRTS!', 'HATS!')

    assert.strictEqual(captor.value, undefined)
  },
  'when verifying': () => {
    testDouble("SHIRTS!")

    td.verify(testDouble(captor.capture()))

    assert.equal(captor.value, "SHIRTS!")
    assert.deepEqual(captor.values, ["SHIRTS!"])
  },
  'when verifying multiple': () => {
    testDouble("SHIRTS!")
    testDouble("SHIRTS AGAIN!")

    td.verify(testDouble(captor.capture()))

    assert.equal(captor.value, "SHIRTS AGAIN!")
    assert.deepEqual(captor.values, ["SHIRTS!", "SHIRTS AGAIN!"])
  }
}

