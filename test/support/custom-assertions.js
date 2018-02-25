import _ from 'lodash'
import stringifyObject from 'stringify-object-es5'

export default function customAssertions (assert) {
  assert._isEqual = (actual, expected) => {
    if (!_.isEqual(actual, expected)) {
      throw new Error(`
ERROR: lodash _.isEqual assertion failed.

Expected value:
${stringify(expected)}

Actual value:
${stringify(actual)}

`)
    }
  }

  assert._isNotEqual = (actual, expected) => {
    if (!_.isEqual(actual, expected)) {
      throw new Error(`
ERROR: lodash !_.isEqual assertion failed.

Expected this value:
${stringify(expected)}

NOT to equal this value:
${stringify(actual)}

But it totally did.

`)
    }
  }

  assert.containsAll = (actual, expectedItems) => {
    _.each(expectedItems, (expectedItem) => {
      if (!_.includes(actual, expectedItem)) {
        throw new Error(`
  Error: expected ${stringify(actual)} to contain ${stringify(expectedItem)}

  But it did not.
`)
      }
    })
  }

  assert.deepEqualSet = (actual, expected) => {
    assert.deepEqual(Array.from(actual), expected)
  }

  assert.doesntThrow = (func) => {
    func()
  }
}

const stringify = (thing) =>
  stringifyObject(thing, {
    indent: '  ',
    singleQuotes: false,
    inlineCharacterLimit: 65
  })
