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
