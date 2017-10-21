let callback, isCallback, subject
module.exports = {
  beforeEach: () => {
    callback = td.replace('../../../src/callback').default
    isCallback = td.replace('../../../src/matchers/is-callback').default

    subject = require('../../../src/when/add-implied-callback-arg-if-necessary').default
  },
  'type is not thenCallback': () => {
    const result = subject('anything', [{}, 50])

    assert.deepEqual(result, [{}, 50])
  },
  'type is thenCallback and no callback matcher is in the args': () => {
    td.when(isCallback(), {ignoreExtraArgs: true}).thenReturn(false)

    const result = subject('thenCallback', [42, 'pants'])

    assert.deepEqual(result, [42, 'pants', callback])
  },
  'type is thenCallback and a callback matcher IS in the args': () => {
    td.when(isCallback('a callback'), {ignoreExtraArgs: true}).thenReturn(true)

    const result = subject('thenCallback', [42, 'pants', 'a callback'])

    assert.deepEqual(result, [42, 'pants', 'a callback'])
  }
}
