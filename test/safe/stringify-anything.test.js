import subject from '../../src/stringify/anything'

module.exports = {
  'basics' () {
    assert._isEqual(subject(undefined), 'undefined')
    assert._isEqual(subject(null), 'null')
    assert._isEqual(subject(0), '0')
    assert._isEqual(subject('foo'), '"foo"')
    assert._isEqual(subject(false), 'false')
  },
  'short strings of objects should be one-lined' () {
    assert._isEqual(subject({
      userId: 42,
      name: 'Jane'
    }), '{userId: 42, name: "Jane"}')
  },
  'matchers' () {
    assert._isEqual(subject(td.matchers.isA(Number)), 'isA(Number)')
    assert._isEqual(subject({ val: td.matchers.isA(Number) }), '{val: isA(Number)}')
  },
  'long strings of objects should be multi-lined' () {
    const object = {
      userId: 42,
      name: 'Jane',
      details: {
        kids: ['jack', 'jill']
      }
    }
    object.circular = object

    assert._isEqual(subject(object), '{\n  userId: 42,\n  name: "Jane",\n  details: {kids: ["jack", "jill"]},\n  circular: "[Circular]"\n}')
  },
  'short strings should have quotes escaped' () {
    const shortString = 'hey "justin"!'

    assert._isEqual(subject(shortString), '"hey \\\"justin\\\"!"') // eslint-disable-line
  },
  'multiline strings should be heredoc-d' () {
    const longString = 'ojsaodjasiodjsaodijsado asj asodjaosdj asodjsaoidjsa odjasoidjasodjas\nasdojsadojdosajodsajd saoji joasdjoajsd\nasdjoj\n\nasdojasdoajsdoasjdaosjdoasjsaodjoadjoasjdojasdojsaodijsaidojojsoidjasodij\naoso'

    assert._isEqual(subject(longString), '"""\n' + longString + '\n"""')
  }
}
