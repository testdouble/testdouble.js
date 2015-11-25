describe '.matchers', ->
  Given -> @matchers = requireSubject('lib/matchers')

  describe '.isA', ->
    context 'numbers', ->
      Given -> @matcher = @matchers.isA(Number)
      Then -> @matcher.__matches(5) == true
      Then -> @matcher.__matches(new Number(5)) == true
      Then -> @matcher.__matches(Number(5)) == true
      Then -> @matcher.__matches(Number("foo")) == true
      Then -> @matcher.__matches("foo") == false

    context 'strings', ->
      Given -> @matcher = @matchers.isA(String)
      Then -> @matcher.__matches(5) == false
      Then -> @matcher.__matches("plop") == true
      Then -> @matcher.__matches(String("plop")) == true
      Then -> @matcher.__matches(new String("plop")) == true

    context 'booleans', ->
      Given -> @matcher = @matchers.isA(Boolean)
      Then -> @matcher.__matches(false) == true
      Then -> @matcher.__matches(true) == true
      Then -> @matcher.__matches(Boolean(false)) == true
      Then -> @matcher.__matches(new Boolean(false)) == true
      Then -> @matcher.__matches("false") == false
      Then -> @matcher.__matches(undefined) == false

    context 'other junk', ->
      Then -> @matchers.isA(Array).__matches([]) == true
      Then -> @matchers.isA(Object).__matches([]) == true
      Then -> @matchers.isA(Date).__matches(new Date()) == true
      Then -> @matchers.isA(Date).__matches(new Object()) == false

  describe '.anything', ->
    Then -> @matchers.anything().__matches(null) == true
    Then -> @matchers.anything().__matches(undefined) == true
    Then -> @matchers.anything().__matches(new Date()) == true
    Then -> @matchers.anything().__matches(a: 'foo', b: 'bar') == true

  describe '.contains', ->
    context 'strings', ->
      Then -> @matchers.contains('bar').__matches('foobarbaz') == true
      Then -> @matchers.contains('biz').__matches('foobarbaz') == false
      Then -> shouldThrow (=> @matchers.contains(48).__matches()), """
        the contains() matcher only supports strings, arrays, and plain objects
        """

    context 'arrays', ->
      Then -> @matchers.contains('a').__matches(['a','b','c']) == true
      Then -> @matchers.contains('a','c').__matches(['a','b','c']) == true
      Then -> @matchers.contains(['a','c']).__matches(['a','b','c']) == false
      Then -> @matchers.contains(['a','c']).__matches([1, ['a','c'], 4]) == true
      Then -> @matchers.contains(['a','c']).__matches(['a','b','z']) == false

    context 'objects', ->
      Then -> @matchers.contains(foo: 'bar', baz: 42).__matches(foo: 'bar', baz: 42, stuff: this) == true
      Then -> @matchers.contains(foo: 'bar', lol: 42).__matches(foo: 'bar', baz: 42) == false
      Then -> @matchers.contains(lol: {deep: [4,2]}).__matches(lol: {deep: [4,2], other: "stuff"}) == true
      Then -> @matchers.contains(deep: {thing: 'stuff'}).__matches({}) == false
      Then -> @matchers.contains(deep: {thing: 'stuff'}).__matches(deep: {thing: 'stuff', shallow: 5}) == true
      Then -> @matchers.contains({container: {size: 'S'}}).__matches({ingredient: 'beans', container: { type: 'cup', size: 'S'}}) == true

  describe 'argThat', ->
    Then -> @matchers.argThat((arg) -> arg > 5).__matches(6) == true
    Then -> @matchers.argThat((arg) -> arg > 5).__matches(5) == false


