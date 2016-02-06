describe 'when', ->
  Given -> @when = requireSubject('lib/when')
  Given -> @function = requireSubject('lib/function')
  Given -> @testDouble = @function()

  describe 'no-arg stubbing', ->
    context 'foo', ->
      Given -> @when(@testDouble()).thenReturn("foo")
      Then -> @testDouble() == "foo"
    context 'bar', ->
      Given -> @when(@testDouble()).thenReturn("bar")
      Then -> @testDouble() == "bar"

  describe 'last-in-wins overwriting', ->
    Given -> @when(@testDouble("something")).thenReturn("gold")
    Given -> @when(@testDouble("something")).thenReturn("iron")
    Then -> @testDouble("something") == "iron"

  describe 'conditional stubbing', ->
    Given -> @when(@testDouble(1)).thenReturn("foo")
    Given -> @when(@testDouble(2)).thenReturn("bar")
    Given -> @when(@testDouble(lol: 'cheese')).thenReturn('nom')
    Given -> @when(@testDouble(lol: 'fungus')).thenReturn('eww')
    Given -> @when(@testDouble({lol: 'fungus'}, 2)).thenReturn('eww2')
    Then -> @testDouble() == undefined
    And -> @testDouble(1) == "foo"
    And -> @testDouble(2) == "bar"
    And -> @testDouble(lol: 'cheese') == "nom"
    And -> @testDouble(lol: 'fungus') == "eww"
    And -> @testDouble({lol: 'fungus'}, 2) == "eww2"

  describe 'multiple test doubles', ->
    Given -> @td1 = @when(@function()()).thenReturn("lol1")
    Given -> @td2 = @when(@function()()).thenReturn("lol2")
    Then -> @td1() == "lol1"
    Then -> @td2() == "lol2"

  describe 'using matchers', ->
    Given -> @matchers = requireSubject('lib/matchers')
    Given -> @when(@testDouble(88, @matchers.isA(Number))).thenReturn("yay")
    Then -> @testDouble(88, 5) == "yay"
    Then -> @testDouble(44, 5) == undefined
    Then -> @testDouble(88, "five") == undefined

  describe 'stubbing sequential returns', ->
    context 'a single stubbing', ->
      Given -> @when(@testDouble()).thenReturn(10,9)
      When -> [@first, @second, @third] = [@testDouble(), @testDouble(), @testDouble()]
      Then -> @first == 10
      Then -> @second == 9
      Then -> @third == 9 #<-- last one repeats

    context 'two overlapping stubbings', ->
      Given -> @when(@testDouble()).thenReturn('A')
      Given -> @testDouble() #<-- returns A, td's callCount will be 1
      Given -> @when(@testDouble()).thenReturn('B', 'C')
      Then -> @testDouble() == 'B'

  describe 'stubbing actions with `thenDo` instead of `thenReturn`', ->
    Given -> @verify = requireSubject('lib/verify')
    Given -> @someAction = @function()
    Given -> @when(@testDouble(55)).thenDo(@someAction)
    When -> @testDouble(55)
    Then -> @verify(@someAction(55))

  describe 'stubbing actions with `thenThrow` instead of `thenReturn`', ->
    Given -> @error = new Error('lol')
    Given -> @when(@testDouble(42)).thenThrow(@error)
    When -> try @testDouble(42) catch e then @result = e
    Then -> @error == @result

  describe 'config object', ->
    describe 'ignoring extra arguments', ->
      context 'for a no-arg stubbing', ->
        Given -> @when(@testDouble(), ignoreExtraArgs: true).thenReturn('pewpew')
        When -> @result = @testDouble('so', 'many', 'args')
        Then -> @result == 'pewpew'

      context 'when an initial-arg-matters', ->
        Given -> @when(@testDouble('important'), ignoreExtraArgs: true).thenReturn('neat')

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
        Given -> @when(@testDouble(), times: 2).thenReturn('pants')
        When -> @result = [@testDouble(), @testDouble(), @testDouble()]
        Then -> expect(@result).to.deep.equal(['pants', 'pants', undefined])

      context 'two overlapping stubbings', ->
        Given -> @when(@testDouble()).thenReturn('NO')
        Given -> @when(@testDouble(), times: 1).thenReturn('YES')
        When -> @result = [@testDouble(), @testDouble(), @testDouble()]
        Then -> expect(@result).to.deep.equal(['YES', 'NO', 'NO'])

