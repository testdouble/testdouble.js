import Double from '../../src/value/double'

module.exports = {
  'basic instantiation': () => {
    const subject = new Double('name', 'real thing', 'fake thing')

    assert.equal(subject.name, 'name')
    assert.equal(subject.real, 'real thing')
    assert.equal(subject.fake, 'fake thing')
  }
}
