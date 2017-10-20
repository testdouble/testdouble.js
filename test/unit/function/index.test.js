import Double from '../../../src/value/double'

let create, subject
module.exports = {
  beforeEach: () => {
    create = td.replace('../../../src/function/create').default

    subject = require('../../../src/function/index').default
  },
  'pass in a name': () => {
    const double = Double.create(null, null, null, () => 'fake thing')
    td.when(create('foo', null)).thenReturn(double)

    const result = subject('foo')

    assert.equal(result, 'fake thing')
  },
  'pass in a named function': () => {
    function bar () {}
    const double = Double.create(null, null, null, () => 'fake bar')
    td.when(create('bar', bar)).thenReturn(double)

    const result = subject(bar)

    assert.equal(result, 'fake bar')
  },
  'pass in an unnamed function': () => {
    const unnamedFunc = eval('(function () {})') //eslint-disable-line
    const double = Double.create(null, null, null, () => 'fake')
    td.when(create(null, unnamedFunc)).thenReturn(double)

    const result = subject(unnamedFunc)

    assert.equal(result, 'fake')
  }
}
