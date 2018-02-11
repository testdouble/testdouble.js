const td = require('../..')
const expect = require('expect')

require('testdouble-jest')(td, jest)

let bar, baz, qux, quux, subject
describe('td.replace', () => {
  beforeEach(() => {
    bar = td.replace('./bar')
    baz = td.replace('./baz', () => 'woot')
    qux = td.replace('./qux', () => 'so fake!')
    quux = td.replace('./quux', td.func('quux'))

    subject = require('./foo')
  })
  it('tdjs will imitate the dep with no-args', () => {
    td.when(bar(42)).thenReturn('yay!')

    const result = subject()

    expect(result.bar).toEqual('yay!')
  })
  it('td.reset() will not pollute stubbings', () => {
    const result = subject()

    expect(result.bar).toEqual(undefined)
  })
  it('can pass a factory', () => {
    const result = subject()

    expect(result.baz).toEqual('woot')
  })
  it('can pass the virtual option, too', () => {
    const result = subject()

    expect(result.qux).toEqual('so fake!')
  })
  it('can assert a call', () => {
    subject()

    td.verify(quux(1337), {times: 1})
  })
  afterEach(() => {
    td.reset()
  })
})

