import assert from 'assert'

let subject, Adder, Subtractor, Multiplier, divider, result
describe('Calculator', () => {
  beforeEach(() => {
    Adder = td.replace('../../lib/adder')
    Subtractor = td.replace('../../lib/subtractor')
    Multiplier = td.replace('../../lib/multiplier').default
    divider = td.replace('../../lib/divider').default
    const Calculator = require('../../lib/calculator').default
    subject = new Calculator
  })

  describe('#calculate', () => {
    if (!NODE_JS) return 'module replacement is not supported!'

    it('delegates to an Adder', () => {
      td.when(Adder.prototype.add(4,9)).thenReturn('yay math!')

      result = subject.calculate('add', 4, 9)

      assert.equal(result, 'yay math!')
    })

    it('delegates to a Subtractor', () => {
      td.when(Subtractor.prototype.subtract(9,8)).thenReturn('minus math!')

      result = subject.calculate('subtract', 9, 8)

      assert.equal(result, 'minus math!')
    })

    it('delegates to a Multiplier', () => {
      td.when(Multiplier.prototype.multiply(1, 4)).thenReturn('times math!')

      result = subject.calculate('multiply', 1, 4)

      assert.equal(result, 'times math!')
    })

    it('delegates to a really weird and very deeply nested Divider', () => {
      // This is a very bad test to verify deep nesting.
      // Please do not write things like this!
      td.when(divider.ohAndAlso.Executor.prototype.execute()).thenReturn('lol')

      result = subject.calculate('divide', 10, 2)

      td.verify(divider.numerator.set(10))
      td.verify(divider.otherOptions.divisor.setThatToo(2))
      assert.equal(result, 'lol')
    })
  })
})
