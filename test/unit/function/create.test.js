let Double, generateFakeFunction, subject
module.exports = {
  beforeEach: () => {
    Double = td.replace('../../../src/value/double').default
    generateFakeFunction = td.replace('../../../src/function/generate-fake-function').default

    subject = require('../../../src/function/create').default
  },
  'puts the lime in the coconut': () => {
    td.when(Double.create('a name', 'a real', 'a parent', generateFakeFunction)).thenReturn('yasss')

    const result = subject('a name', 'a real', 'a parent', generateFakeFunction)

    assert.equal(result, 'yasss')
  }

}
