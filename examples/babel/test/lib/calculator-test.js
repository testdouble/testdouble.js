import assert from 'assert'

let subject, adder, subtractor
describe('Calculator', () => {
  beforeEach(() => {
    adder = td.replace('../../lib/adder')
    subtractor = td.replace('../../lib/subtractor')
    subject = require('../../lib/calculator')
  })

  describe('#calculate', () => {
    describe('adding two numbers', () => {
      it('delegates to an Adder', () => {
        td.when(adder.add(4,9)).thenReturn('yay math!')

        const result = subject.calculate('add', 4, 9)

        assert.equal(result, 'yay math!')
      })
    })
  })
})
