describe 'when', ->
  Given -> @when = requireSubject('lib/when')
  Given -> @create = requireSubject('lib/create')

  describe 'no-arg stubbing', ->
    Given -> @testDouble = @create()
    context 'foo', ->
      Given -> @when(@testDouble()).thenReturn("foo")
      Then -> @testDouble() == "foo"
    context 'bar', ->
      Given -> @when(@testDouble()).thenReturn("bar")
      Then -> @testDouble() == "bar"

  describe 'last-in-wins overwriting', ->
    Given -> @testDouble = @create()
    Given -> @when(@testDouble("something")).thenReturn("gold")
    Given -> @when(@testDouble("something")).thenReturn("iron")
    Then -> @testDouble("something") == "iron"

  describe 'conditional stubbing', ->
    Given -> @testDouble = @create()
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
    Given -> @td1 = @when(@create()()).thenReturn("lol1")
    Given -> @td2 = @when(@create()()).thenReturn("lol2")
    Then -> @td1() == "lol1"
    Then -> @td2() == "lol2"

  describe 'using matchers', ->
    Given -> @matchers = requireSubject('lib/matchers')
    Given -> @testDouble = @create()
    Given -> @when(@testDouble(88, @matchers.isA(Number))).thenReturn("yay")
    Then -> @testDouble(88, 5) == "yay"
    Then -> @testDouble(44, 5) == undefined
    Then -> @testDouble(88, "five") == undefined

  describe 'stubbing sequential returns', ->
    Given -> @testDouble = @create()
    Given -> @when(@testDouble()).thenReturn(10,9)
    When -> [@first, @second, @third] = [@testDouble(), @testDouble(), @testDouble()]
    Then -> @first == 10
    Then -> @second == 9
    Then -> @third == 9 #<-- last one repeats
