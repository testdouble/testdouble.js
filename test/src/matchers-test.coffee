matches = (expected, actual) ->
  if NODE_JS
    require('../../src/args-match')([expected], [actual], {})
  else
    expected.__matches(actual)

describe '.matchers', ->
  Given -> @matches = matches

  describe '.isA', ->
    context 'numbers', ->
      Given -> @matcher = td.matchers.isA(Number)
      Then -> @matches(@matcher, 5) == true
      Then -> @matches(@matcher, new Number(5)) == true
      Then -> @matches(@matcher, Number(5)) == true
      Then -> @matches(@matcher, Number("foo")) == true
      Then -> @matches(@matcher, "foo") == false

    context 'strings', ->
      Given -> @matcher = td.matchers.isA(String)
      Then -> @matches(@matcher, 5) == false
      Then -> @matches(@matcher, "plop") == true
      Then -> @matches(@matcher, String("plop")) == true
      Then -> @matches(@matcher, new String("plop")) == true

    context 'booleans', ->
      Given -> @matcher = td.matchers.isA(Boolean)
      Then -> @matches(@matcher, false) == true
      Then -> @matches(@matcher, true) == true
      Then -> @matches(@matcher, Boolean(false)) == true
      Then -> @matches(@matcher, new Boolean(false)) == true
      Then -> @matches(@matcher, "false") == false
      Then -> @matches(@matcher, undefined) == false

    context 'other junk', ->
      Then -> @matches(td.matchers.isA(Array), []) == true
      Then -> @matches(td.matchers.isA(Object), []) == true
      Then -> @matches(td.matchers.isA(Date), new Date()) == true
      Then -> @matches(td.matchers.isA(Date), new Object()) == false

  describe '.anything', ->
    Then -> @matches(td.matchers.anything(), null) == true
    Then -> @matches(td.matchers.anything(), undefined) == true
    Then -> @matches(td.matchers.anything(), new Date()) == true
    Then -> @matches(td.matchers.anything(), a: 'foo', b: 'bar') == true

  describe '.contains', ->
    context 'strings', ->
      Then -> @matches(td.matchers.contains('bar'), 'foobarbaz') == true
      Then -> @matches(td.matchers.contains('biz'), 'foobarbaz') == false
      Then -> shouldThrow (=> td.matchers.contains(48).__matches()), """
        the contains() matcher only supports strings, arrays, and plain objects
        """

    context 'arrays', ->
      Then -> @matches(td.matchers.contains('a'), ['a','b','c']) == true
      Then -> @matches(td.matchers.contains('a','c'), ['a','b','c']) == true
      Then -> @matches(td.matchers.contains(['a','c']), ['a','b','c']) == false
      Then -> @matches(td.matchers.contains(['a','c']), [1, ['a','c'], 4]) == true
      Then -> @matches(td.matchers.contains(['a','c']), ['a','b','z']) == false

    context 'objects', ->
      Then -> @matches(td.matchers.contains(foo: 'bar', baz: 42), foo: 'bar', baz: 42, stuff: this) == true
      Then -> @matches(td.matchers.contains(foo: 'bar', lol: 42), foo: 'bar', baz: 42) == false
      Then -> @matches(td.matchers.contains(lol: {deep: [4,2]}), lol: {deep: [4,2], other: "stuff"}) == true
      Then -> @matches(td.matchers.contains(deep: {thing: 'stuff'}), {}) == false
      Then -> @matches(td.matchers.contains(deep: {thing: 'stuff'}), deep: {thing: 'stuff', shallow: 5}) == true
      Then -> @matches(td.matchers.contains({container: {size: 'S'}}), {ingredient: 'beans', container: { type: 'cup', size: 'S'}}) == true

  describe 'argThat', ->
    Then -> @matches(td.matchers.argThat((arg) -> arg > 5), 6) == true
    Then -> @matches(td.matchers.argThat((arg) -> arg > 5), 5) == false

  describe 'not', ->
    Then -> @matches(td.matchers.not(5), 6) == true
    Then -> @matches(td.matchers.not(5), 5) == false
    Then -> @matches(td.matchers.not(['hi']), ['hi']) == false



