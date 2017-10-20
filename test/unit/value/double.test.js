import Double from '../../../src/value/double'

module.exports = {
  'public Double.create factory method': () => {
    const parent = Double.create('parent')

    const subject = Double.create('name', 'real thing', parent, (double) => `${double.name} fake`)

    assert.equal(subject.name, 'name')
    assert.equal(subject.fullName, 'parent.name')
    assert.equal(subject.real, 'real thing')
    assert.equal(subject.fake, 'name fake')
    assert.equal(subject.parent, parent)
    assert.deepEqualSet(parent.children, [subject])
  },
  'adding children - fullName computes parent names with dot joiner': () => {
    const grandparent = Double.create('foo')
    const parent = Double.create('bar')
    const child = Double.create('baz')
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
    const parent = Double.create()
    const child = Double.create()
    parent.addChild(child)

    assert.equal(child.name, null)
    assert.equal(child.fullName, null)
  },
  'fullName is "parent.(unnamed)" when grandparent+child name is null': () => {
    const grandparent = Double.create()
    const parent = Double.create('parent')
    const child = Double.create()
    grandparent.addChild(parent)
    parent.addChild(child)

    assert.equal(child.name, null)
    assert.strictEqual(child.fullName, '(unnamed).parent.(unnamed)')
  },
  '#toString': {
    'toString for unnamed double': () => {
      const double = Double.create()

      assert.equal(double.toString(), '[test double (unnamed)]')
    },
    'toString for named double': () => {
      const double = Double.create('name', null, Double.create('full'))

      assert.equal(double.toString(), '[test double for "full.name"]')
    },
    'toString supports mutation (necessary sometimes for td.replace() to depend on td.func())': () => {
      const double = Double.create('old name')

      double.name = 'new name'

      assert.equal(double.name, 'new name')
      assert.equal(double.toString(), '[test double for "new name"]')
    }
  }
}
