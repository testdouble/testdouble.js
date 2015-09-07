describe 'when', ->
  Given -> @when = requireSubject('lib/when')

  describe 'unconditional stubbing', ->
    Given -> @testDouble = requireSubject('lib/create')()
    context 'foo', ->
      Given -> @when(@testDouble()).thenReturn("foo")
      Then -> @testDouble() == "foo"
    context 'bar', ->
      Given -> @when(@testDouble()).thenReturn("bar")
      Then -> @testDouble() == "bar"
