let gatherProps, copyProps, isPrimitiveLike, chainPrototype, subject
module.exports = {
  beforeEach: () => {
    gatherProps = td.replace('../../../../src/imitate/overwrite-children/gather-props').default
    copyProps = td.replace('../../../../src/imitate/overwrite-children/copy-props').default
    isPrimitiveLike = td.replace('../../../../src/imitate/overwrite-children/is-primitive-like').default
    chainPrototype = td.replace('../../../../src/imitate/overwrite-children/chain-prototype').default
    subject = require('../../../../src/imitate/overwrite-children').default

    td.when(isPrimitiveLike(td.matchers.anything())).thenReturn(false)
  },
  'thing is primitive-like (then do nothing)': () => {
    const target = {}
    td.when(isPrimitiveLike(target)).thenReturn(true)

    subject('some original', target, () => { throw new Error('do not fire!') })

    assert.deepEqual(target, {})
    td.verify(gatherProps(), {ignoreExtraArgs: true, times: 0})
    td.verify(copyProps(), {ignoreExtraArgs: true, times: 0})
    td.verify(chainPrototype(), {ignoreExtraArgs: true, times: 0})
  },
  'an array': () => {
    const target = []
    const overwriteChildren = td.function('.overwriteChildren')
    td.when(overwriteChildren('foo', '[0]')).thenReturn('fake foo')
    td.when(overwriteChildren('bar', '[1]')).thenReturn('fake bar')

    subject(['foo', 'bar'], target, overwriteChildren)

    assert.deepEqual(target, ['fake foo', 'fake bar'])
    td.verify(gatherProps(), {ignoreExtraArgs: true, times: 0})
    td.verify(copyProps(), {ignoreExtraArgs: true, times: 0})
  },
  'an object': () => {
    const overwriteChildren = td.function('.overwriteChildren')
    const propCaptor = td.matchers.captor()
    td.when(gatherProps('og')).thenReturn('props')

    subject('og', 'target', overwriteChildren)

    td.verify(copyProps('target', 'props', propCaptor.capture()))

    // Phase two: test the prop overwriter directly
    td.when(overwriteChildren('og val', '.aName')).thenReturn('new val')
    td.when(chainPrototype('og', 'target', 'aName', 'og val', 'new val'))
      .thenReturn('wrapped val')

    const result = propCaptor.value('aName', 'og val')

    assert.equal(result, 'wrapped val')
  }
}
