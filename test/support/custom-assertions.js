export default function customAssertions (assert) {
  assert.deepEqualSet = (actual, expected) => {
    assert.deepEqual(Array.from(actual), expected)
  }

  assert.doesntThrow = (func) => {
    func()
  }
}
