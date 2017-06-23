let initializeNames, createImitation, overwriteChildren, subject
module.exports = {
  beforeEach: () => {
    initializeNames = td.replace('../../../src/imitate/initialize-names').default
    createImitation = td.replace('../../../src/imitate/create-imitation').default
    overwriteChildren = td.replace('../../../src/imitate/overwrite-children').default
    subject = require('../../../src/imitate').default
  },
  'golden path': () => {
    td.when(initializeNames('something', undefined)).thenReturn(['a name'])
    td.when(createImitation('something', ['a name'])).thenReturn('a fake')
    const childCallbackCaptor = td.matchers.captor()

    const result = subject('something')

    assert.equal(result, 'a fake')
    td.verify(overwriteChildren('something', 'a fake', childCallbackCaptor.capture()))

    // Now make sure the child callback is handled correctly:
    td.when(initializeNames('another thing', ['a name', 'another name'])).thenReturn(['new names'])
    td.when(createImitation('another thing', ['new names'])).thenReturn('fake2')

    const result2 = childCallbackCaptor.value('another thing', 'another name')

    assert.equal(result2, 'fake2')
    td.verify(overwriteChildren('another thing', 'fake2', td.matchers.isA(Function)))
  },
  'breaks cycles by tracking encounteredObjects': () => {
    const top = {type: 'top'}
    const childCallbackCaptor = td.matchers.captor()
    td.when(initializeNames(top, undefined)).thenReturn(['lol'])
    td.when(createImitation(top, ['lol']), {times: 1}).thenReturn('fake-top')

    const result = subject(top)

    assert.equal(result, 'fake-top')
    td.verify(overwriteChildren(top, 'fake-top', childCallbackCaptor.capture()))

    // Make sure it short-circuits the known thing
    const result2 = childCallbackCaptor.value(top, 'whatever')

    assert.equal(result2, 'fake-top')
  }
}
