describe 'argument captors', ->
  Given -> @when = requireSubject('lib/when')
  Given -> @verify = requireSubject('lib/verify')
  Given -> @testDouble = requireSubject('lib/create')()

  Given -> @subject = requireSubject('lib/captor')
  Given -> @captor = @subject()

  describe 'when stubbing', ->
    Given -> @when(@testDouble(@captor.capture())).thenReturn('foobaby')
    When -> @testDouble("PANTS!")
    Then -> @captor.value == "PANTS!"

  describe 'when verifying', ->
    Given -> @testDouble("SHIRTS!")
    When -> @verify(@testDouble(@captor.capture()))
    Then -> @captor.value == "SHIRTS!"


