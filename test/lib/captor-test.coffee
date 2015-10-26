describe 'argument captors (a special sub-type of matchers)', ->
  Given -> @when = requireSubject('lib/when')
  Given -> @verify = requireSubject('lib/verify')
  Given -> @testDouble = requireSubject('lib/function')()

  Given -> @subject = requireSubject('lib/matchers/captor')
  Given -> @captor = @subject()

  describe 'when stubbing', ->
    Given -> @when(@testDouble(@captor.capture())).thenReturn('foobaby')
    When -> @stubbing = @testDouble("PANTS!")
    Then -> @captor.value == "PANTS!"
    And -> @stubbing == 'foobaby'

  describe 'when verifying', ->
    Given -> @testDouble("SHIRTS!")
    When -> @verify(@testDouble(@captor.capture()))
    Then -> @captor.value == "SHIRTS!"


