describe 'argument captors (a special sub-type of matchers)', ->
  Given -> @testDouble = td.function()
  Given -> @captor = td.matchers.captor()

  describe 'when stubbing', ->
    Given -> td.when(@testDouble(@captor.capture())).thenReturn('foobaby')
    When -> @stubbing = @testDouble("PANTS!")
    Then -> @captor.value == "PANTS!"
    And -> @stubbing == 'foobaby'

  describe 'when verifying', ->
    Given -> @testDouble("SHIRTS!")
    When -> td.verify(@testDouble(@captor.capture()))
    Then -> @captor.value == "SHIRTS!"


