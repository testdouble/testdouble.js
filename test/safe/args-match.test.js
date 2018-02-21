import subject from '../../src/args-match'

let result
module.exports = {
  'allow matchers': () => {
    result = subject([td.matchers.anything()], [5])

    assert.equal(result, true)
  },
  'disallow matchers': {
    'with a matcher': () => {
      result = subject([td.matchers.anything()], [5], {
        allowMatchers: false
      })

      assert.equal(result, false)
    },
    'exact match': () => {
      result = subject([5], [5], {allowMatchers: false})

      assert.equal(result, true)
    }
  }
}
