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
