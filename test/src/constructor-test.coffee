describe 'td.constructor', ->
  Thing = SuperThing = null
  Given -> class SuperThing
    biz: -> 1
  Given -> class Thing extends SuperThing
  Given -> Thing::foo = -> 2
  Given -> Thing.bar = -> 3
  Given -> Thing::instanceAttr = 'baz'
  Given -> Thing.staticAttr = 'qux'
  Given -> @fakeType = td.constructor(Thing)
  Given -> @fakeInstance = new @fakeType('pants')

  describe 'the constructor function itself', ->
    Then -> td.verify(@fakeType('pants'))

    describe 'stubbing it (with an error, return makes no sense)', ->
      Given -> td.when(new @fakeType('!')).thenThrow('¡')
      Given -> @error = null
      When -> try new @fakeType('!') catch e then @error = e
      Then -> @error == '¡'

  Then -> td.when(@fakeInstance.foo()).thenReturn(7)() == 7

  describe 'stub method on prototype, use from any instance', ->
    When -> td.when(@fakeType.prototype.foo()).thenReturn(4)
    Then -> @fakeType.prototype.foo() == 4
    Then -> @fakeInstance.foo() == 4

  # The static method can be stubbed
  Then -> td.when(@fakeType.bar()).thenReturn(5)() == 5

  # Super type's methods can be stubbed, too
  Then -> td.when(@fakeInstance.biz()).thenReturn(6)() == 6

  # Things print OK
  Then -> @fakeType.toString() == '[test double constructor for "Thing"]'
  Then -> @fakeType.prototype.foo.toString() == '[test double for "Thing#foo"]'
  Then -> @fakeType.bar.toString() == '[test double for "Thing.bar"]'

  # Fake things pass instanceof checks
  Then -> @fakeInstance instanceof Thing

  # Original attributes are carried over
  Then -> @fakeType.prototype.instanceAttr == 'baz'
  Then -> @fakeInstance.instanceAttr == 'baz'
  Then -> @fakeType.staticAttr == 'qux'
