import subject from '../../src/args-match'

let result
module.exports = {
  'allow matchers': () => {
    result = subject([td.matchers.anything()], [5])

    assert._isEqual(result, true)
  },
  'disallow matchers': {
    'with a matcher': () => {
      result = subject([td.matchers.anything()], [5], {
        allowMatchers: false
      })

      assert._isEqual(result, false)
    },
    'exact match': () => {
      result = subject([5], [5], {allowMatchers: false})

      assert._isEqual(result, true)
    }
  }
}
