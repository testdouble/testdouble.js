describe 'when', ->
  Given -> @testDouble = td.function()

  describe 'no-arg stubbing', ->
    context 'foo', ->
      Given -> td.when(@testDouble()).thenReturn("foo")
      Then -> @testDouble() == "foo"
    context 'bar', ->
      Given -> td.when(@testDouble()).thenReturn("bar")
      Then -> @testDouble() == "bar"

  describe 'last-in-wins overwriting', ->
    Given -> td.when(@testDouble("something")).thenReturn("gold")
    Given -> td.when(@testDouble("something")).thenReturn("iron")
    Then -> @testDouble("something") == "iron"

  describe 'conditional stubbing', ->
    Given -> td.when(@testDouble(1)).thenReturn("foo")
    Given -> td.when(@testDouble(2)).thenReturn("bar")
    Given -> td.when(@testDouble(lol: 'cheese')).thenReturn('nom')
    Given -> td.when(@testDouble(lol: 'fungus')).thenReturn('eww')
    Given -> td.when(@testDouble({lol: 'fungus'}, 2)).thenReturn('eww2')
    Then -> @testDouble() == undefined
    And -> @testDouble(1) == "foo"
    And -> @testDouble(2) == "bar"
    And -> @testDouble(lol: 'cheese') == "nom"
    And -> @testDouble(lol: 'fungus') == "eww"
    And -> @testDouble({lol: 'fungus'}, 2) == "eww2"

  describe 'multiple test doubles', ->
    Given -> @td1 = td.when(td.function()()).thenReturn("lol1")
    Given -> @td2 = td.when(td.function()()).thenReturn("lol2")
    Then -> @td1() == "lol1"
    Then -> @td2() == "lol2"

  describe 'using matchers', ->
    Given -> td.when(@testDouble(88, td.matchers.isA(Number))).thenReturn("yay")
    Then -> @testDouble(88, 5) == "yay"
    Then -> @testDouble(44, 5) == undefined
    Then -> @testDouble(88, "five") == undefined

  describe 'using buried matcher', ->
    Given -> td.when(@testDouble({ key: td.matchers.isA(String) })).thenReturn("yay")
    Then -> @testDouble({ key: "testytest" }) == "yay"
    Then -> @testDouble({ key: true }) == undefined
    Then -> @testDouble({}) == undefined
    Then -> @testDouble(42) == undefined

  describe 'stubbing sequential returns', ->
    context 'a single stubbing', ->
      Given -> td.when(@testDouble()).thenReturn(10,9)
      When -> [@first, @second, @third] = [@testDouble(), @testDouble(), @testDouble()]
      Then -> @first == 10
      Then -> @second == 9
      Then -> @third == 9 #<-- last one repeats

    context 'two overlapping stubbings', ->
      Given -> td.when(@testDouble()).thenReturn('A')
      Given -> @testDouble() #<-- returns A, td's callCount will be 1
      Given -> td.when(@testDouble()).thenReturn('B', 'C')
      Then -> @testDouble() == 'B'

  describe 'stubbing actions with `thenDo` instead of `thenReturn`', ->
    Given -> @someAction = td.function()
    Given -> td.when(@testDouble(55)).thenDo(@someAction)
    When -> @testDouble(55)
    Then -> td.verify(@someAction(55))

  describe 'stubbing actions with `thenThrow` instead of `thenReturn`', ->
    Given -> @error = new Error('lol')
    Given -> td.when(@testDouble(42)).thenThrow(@error)
    When -> try @testDouble(42) catch e then @result = e
    Then -> @error == @result

  describe 'stubbing error, no invocation found', ->
    Given -> td.reset()
    Given -> try
        td.when().thenReturn('hi')
      catch e
        @error = e
    Then -> @error.message == """
      Error: testdouble.js - td.when - No test double invocation call detected for `when()`.

        Usage:
          when(myTestDouble('foo')).thenReturn('bar')
      """

  describe 'config object', ->
    describe 'ignoring extra arguments', ->
      context 'for a no-arg stubbing', ->
        Given -> td.when(@testDouble(), ignoreExtraArgs: true).thenReturn('pewpew')
        When -> @result = @testDouble('so', 'many', 'args')
        Then -> @result == 'pewpew'

      context 'when an initial-arg-matters', ->
        Given -> td.when(@testDouble('important'), ignoreExtraArgs: true).thenReturn('neat')

        context 'satisfied without extra args', ->
          Then -> @testDouble('important') == 'neat'

        context 'satisfied with extra args', ->
          Then -> @testDouble('important', 'not important') == 'neat'

        context 'unsatisfied with no args', ->
          Then -> @testDouble() == undefined

        context 'unsatisfied with extra args', ->
          Then -> @testDouble('unimportant', 'not important') == undefined

    describe 'limiting times stubbing will work', ->
      context 'a single stub', ->
        Given -> td.when(@testDouble(), times: 2).thenReturn('pants')
        When -> @result = [@testDouble(), @testDouble(), @testDouble()]
        Then -> expect(@result).to.deep.equal(['pants', 'pants', undefined])

      context 'two overlapping stubbings', ->
        Given -> td.when(@testDouble()).thenReturn('NO')
        Given -> td.when(@testDouble(), times: 1).thenReturn('YES')
        When -> @result = [@testDouble(), @testDouble(), @testDouble()]
        Then -> expect(@result).to.deep.equal(['YES', 'NO', 'NO'])

