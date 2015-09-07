describe 'when', ->
  Given -> @when = requireSubject('lib/when')
  Given -> @create = requireSubject('lib/create')

  describe 'unconditional stubbing', ->
    Given -> @testDouble = @create()
    context 'foo', ->
      Given -> @when(@testDouble()).thenReturn("foo")
      Then -> @testDouble() == "foo"
    context 'bar', ->
      Given -> @when(@testDouble()).thenReturn("bar")
      Then -> @testDouble() == "bar"

  describe 'multiple test doubles', ->
    Given -> @td1 = @when(@create()()).thenReturn("lol1")
    Given -> @td2 = @when(@create()()).thenReturn("lol2")
    Then -> @td1() == "lol1"
    Then -> @td2() == "lol2"
