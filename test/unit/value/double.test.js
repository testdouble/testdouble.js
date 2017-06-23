import Double from '../../../src/value/double'

module.exports = {
  'basic instantiation': () => {
    const subject = new Double('name', 'real thing', 'fake thing')

    assert.equal(subject.name, 'name')
    assert.equal(subject.fullName, 'name')
    assert.equal(subject.real, 'real thing')
    assert.equal(subject.fake, 'fake thing')
  },
  'adding children - fullName computes parent names with dot joiner': () => {
    const grandparent = new Double('foo')
    const parent = new Double('bar')
    const child = new Double('baz')
    grandparent.addChild(parent)
    parent.addChild(child)

    assert.deepEqual([...grandparent.children], [parent])
    assert.equal(parent.parent, grandparent)
    assert.equal(parent.fullName, 'foo.bar')
    assert.deepEqual([...parent.children], [child])
    assert.equal(child.parent, parent)
    assert.equal(child.fullName, 'foo.bar.baz')
  },
  'fullName is null when parent and child names are null': () => {
    const parent = new Double()
    const child = new Double()
    parent.addChild(child)

    assert.equal(child.name, null)
    assert.equal(child.fullName, null)
  },
  'fullName is "parent.(unnamed)" when grandparent+child name is null': () => {
    const grandparent = new Double()
    const parent = new Double('parent')
    const child = new Double()
    grandparent.addChild(parent)
    parent.addChild(child)

    assert.equal(child.name, null)
    assert.strictEqual(child.fullName, '(unnamed).parent.(unnamed)')
  }
}
