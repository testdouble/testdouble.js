matches = (expected, actual) ->
  if NODE_JS
    requireSource('args-match')([expected], [actual], {})
  else
    expected.__matches(actual)

describe '.matchers', ->
  Given -> @matches = matches

  describe '.create', ->
    Given -> @matcher = td.matchers.create
      name: 'isSame'
      matches: (matcherArgs, actual) ->
        matcherArgs[0] == actual
      onCreate: (matcherInstance, matcherArgs) ->
        matcherInstance.__args = matcherArgs

    When -> @matcherInstance = @matcher('foo')
    Then -> @matcherInstance.__name == 'isSame("foo")'
    And -> @matcherInstance.__matches('foo') == true
    And -> @matcherInstance.__matches('bar') == false
    And -> expect(@matcherInstance.__args).to.deep.eq ['foo']

    context 'name is a function', ->
      Given -> @matcher = td.matchers.create
        name: (matcherArgs) ->
          "isThing(#{matcherArgs[0].name})"
        matches: -> true
      When -> @matcherInstance = @matcher(String)
      Then -> @matcherInstance.__name == 'isThing(String)'


    context 'no name or onCreate given', ->
      Given -> @matcher = td.matchers.create(matches: -> true)
      When -> @matcherInstance = @matcher('bar')
      Then -> @matcherInstance.__name == '[Matcher for ("bar")]'

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

    context 'names', ->
      Then -> td.matchers.isA({name: 'Poo'}).__name == 'isA(Poo)'
      Then -> td.matchers.isA({nope: 'foo'}).__name == 'isA({nope: "foo"})'

  describe '.anything', ->
    Then -> @matches(td.matchers.anything(), null) == true
    Then -> @matches(td.matchers.anything(), undefined) == true
    Then -> @matches(td.matchers.anything(), new Date()) == true
    Then -> @matches(td.matchers.anything(), a: 'foo', b: 'bar') == true

  describe '.contains', ->
    context 'strings', ->
      Then -> @matches(td.matchers.contains('bar'), 'foobarbaz') == true
      Then -> @matches(td.matchers.contains('biz'), 'foobarbaz') == false

    context 'arrays', ->
      Then -> @matches(td.matchers.contains('a'), ['a','b','c']) == true
      Then -> @matches(td.matchers.contains('a','c'), ['a','b','c']) == true
      Then -> @matches(td.matchers.contains(['a','c']), ['a','b','c']) == false
      Then -> @matches(td.matchers.contains(['a','c']), [1, ['a','c'], 4]) == true
      Then -> @matches(td.matchers.contains(['a','c']), ['a','b','z']) == false
      Then -> @matches(td.matchers.contains(true, 5, null, undefined), [true, 5, undefined, null]) == true
      Then -> @matches(td.matchers.contains(true, 5, null, undefined), [true, 5, null]) == false

    context 'objects', ->
      Then -> @matches(td.matchers.contains(foo: 'bar', baz: 42), foo: 'bar', baz: 42, stuff: this) == true
      Then -> @matches(td.matchers.contains(foo: 'bar', lol: 42), foo: 'bar', baz: 42) == false
      Then -> @matches(td.matchers.contains(lol: {deep: [4,2]}), lol: {deep: [4,2], other: "stuff"}) == true
      Then -> @matches(td.matchers.contains(deep: {thing: 'stuff'}), {}) == false
      Then -> @matches(td.matchers.contains(deep: {thing: 'stuff'}), deep: {thing: 'stuff', shallow: 5}) == true
      Then -> @matches(td.matchers.contains({container: {size: 'S'}}), {ingredient: 'beans', container: { type: 'cup', size: 'S'}}) == true

    context 'nonsense', ->
      Then -> @matches(td.matchers.contains(42), 42) == false
      Then -> @matches(td.matchers.contains(null), 'shoo') == false
      Then -> @matches(td.matchers.contains(), 'shoo') == false
      Then -> @matches(td.matchers.contains({}), undefined) == false

  describe 'argThat', ->
    Then -> @matches(td.matchers.argThat((arg) -> arg > 5), 6) == true
    Then -> @matches(td.matchers.argThat((arg) -> arg > 5), 5) == false

  describe 'not', ->
    Then -> @matches(td.matchers.not(5), 6) == true
    Then -> @matches(td.matchers.not(5), 5) == false
    Then -> @matches(td.matchers.not(['hi']), ['hi']) == false



