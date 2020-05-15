module.exports = {
  'Behavior when no loaded loaded': {
    async 'should throw an error when no loaded loaded' () {
      try {
        await td.replaceEsm('./fixtures/passenger.mjs')

        assert.fail('td.replaceEsm should have thrown an exception because testdouble loader was not loaded')
      } catch (err) {
        //
      }
    }
  }
}
