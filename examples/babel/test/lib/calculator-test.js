import assert from 'assert'

let subject, adder, subtractor, multiplier, result
describe('Calculator', () => {
  beforeEach(() => {
    adder = td.replace('../../lib/adder')
    subtractor = td.replace('../../lib/subtractor')
    multiplier = td.replace('../../lib/multiplier').default
    const Calculator = require('../../lib/calculator').default
    subject = new Calculator
  })

  describe('#calculate', () => {
    if (!NODE_JS.AT_LEAST_0_11) return 'module replacement is not supported!'

    it('delegates to an Adder', () => {
      td.when(adder.add(4,9)).thenReturn('yay math!')

      result = subject.calculate('add', 4, 9)

      assert.equal(result, 'yay math!')
    })

    it('delegates to a Subtractor', () => {
      td.when(subtractor.subtract(9,8)).thenReturn('minus math!')

      result = subject.calculate('subtract', 9, 8)

      assert.equal(result, 'minus math!')
    })

    it('delegates to a Multiplier', () => {
      td.when(multiplier.multiply(1, 4)).thenReturn('times math!')

      result = subject.calculate('multiply', 1, 4)

      assert.equal(result, 'times math!')
    })
  })
})
