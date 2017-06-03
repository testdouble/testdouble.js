    // 1. create the function
    //    - tack on a tostring method that prints the name
    // 2. (if passed a func), copy-props & shallow td-ify
    // 3 throws it in the "store"
    //   - assigns the name to the entry in the store (if it exists)
let create, imitate, remember, subject
module.exports = {
  beforeEach: () => {
    create = td.replace('../../src/function/create').default
    imitate = td.replace('../../src/function/imitate').default
    remember = td.replace('../../src/function/remember').default

    subject = require('../../src/function/index').default
  },
  'pass in a name': () => {
    td.when(create('foo')).thenReturn('a fake foo')
    td.when(remember('a fake foo', 'foo')).thenReturn('a remembered foo')

    const result = subject('foo')

    assert.equal(result, 'a remembered foo')
  },
  'pass in a function': () => {
    const bar = function bar () {}
    td.when(create('bar')).thenReturn('a fake bar')
    td.when(imitate(bar, 'a fake bar')).thenReturn('an imitated bar')
    td.when(remember('an imitated bar', 'bar')).thenReturn('a remembered bar')

    const result = subject(bar)

    assert.equal(result, 'a remembered bar')
  }
}
