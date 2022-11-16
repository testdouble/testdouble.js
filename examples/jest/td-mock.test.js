const expect = require('@jest/globals').expect

let subject
describe('td.replace', () => {
  beforeEach(() => {
    td.mock('./bar')
    td.mock('./baz', () => () => 'woot')
    td.mock('./qux', () => () => 'so fake!', { virtual: true })
    td.mock('./quux', () => td.func('quux'), { virtual: true })

    subject = require('./foo')
  })
  it('tdjs will imitate the dep with no-args', () => {
    const bar = require('./bar')
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
    const quux = require('./quux')

    subject()

    td.verify(quux(1337), { times: 1 })
  })
})
