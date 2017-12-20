describe 'argument captors (a special sub-type of matchers)', ->
  Given -> @testDouble = td.function()
  Given -> @captor = td.matchers.captor()

  describe 'when stubbing', ->
    Given -> td.when(@testDouble(@captor.capture())).thenReturn('foobaby')
    When -> @stubbing = @testDouble("PANTS!")
    Then -> @captor.value == "PANTS!"
    And -> @stubbing == 'foobaby'

  describe 'when stubbing and other matchers do match', ->
    Given -> td.when(@testDouble(@captor.capture(), 'PANTS!')).thenReturn('barbaby')
    When -> @stubbing = @testDouble('SHIRTS!', 'PANTS!')
    Then -> @captor.value == 'SHIRTS!'
    And -> @stubbing == 'barbaby'

  describe 'when stubbing and other matchers do not match', ->
    Given -> td.when(@testDouble(@captor.capture(), 'PANTS!')).thenReturn('barbaby')
    When -> @stubbing = @testDouble('SHIRTS!', 'HATS!')
    Then -> @captor.value == undefined

  describe 'when verifying', ->
    Given -> @testDouble("SHIRTS!")
    When -> td.verify(@testDouble(@captor.capture()))
    Then -> @captor.value == "SHIRTS!"
    And -> expect(@captor.values).to.deep.eq ["SHIRTS!"]

  describe 'when verifying multiple', ->
    Given -> @testDouble("SHIRTS!")
    And -> @testDouble("SHIRTS AGAIN!")
    When -> td.verify(@testDouble(@captor.capture()))
    Then -> @captor.value == "SHIRTS AGAIN!"
    And -> expect(@captor.values).to.deep.eq ["SHIRTS!", "SHIRTS AGAIN!"]


