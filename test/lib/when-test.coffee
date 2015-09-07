describe 'when', ->
  Given -> @when = requireSubject('lib/when')

  describe 'unconditional stubbing', ->
    Given -> @testDouble = requireSubject('lib/create')
    Given -> @when(@testDouble()).thenReturn("foo")
    When -> @result = @testDouble()
    Then -> @result == "foo"
