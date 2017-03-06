import assert from 'assert'

let subject, Adder, Subtractor, Multiplier, result
describe('Calculator', () => {
  beforeEach(() => {
    Adder = td.replace('../../lib/adder')
    Subtractor = td.replace('../../lib/subtractor')
    Multiplier = td.replace('../../lib/multiplier').default
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
  })
})
