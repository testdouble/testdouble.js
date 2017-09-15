import Double from '../../../src/value/double'

let create, imitate, remember, subject
module.exports = {
  beforeEach: () => {
    create = td.replace('../../../src/function/create').default
    imitate = td.replace('../../../src/imitate').default
    remember = td.replace('../../../src/function/remember').default

    subject = require('../../../src/function/index').default
  },
  'pass in a name': () => {
    const double = new Double(null, null, 'fake thing')
    td.when(create('foo')).thenReturn(double)

    const result = subject('foo')

    assert.equal(result, double.fake)
    td.verify(remember(double))
  },
  'pass in a function': () => {
    function bar () {}
    td.when(imitate(bar)).thenReturn('fake bar')

    const result = subject(bar)

    assert.equal(result, 'fake bar')
  }
}
