describe 'td.constructor', ->
  describe 'being given a constructor function', ->
    Thing = SuperThing = null
    Given -> class SuperThing
      biz: -> 1
    Given -> class Thing extends SuperThing
    Given -> Thing::foo = -> 2
    Given -> Thing.bar = -> 3
    Given -> Thing::instanceAttr = 'baz'
    Given -> Thing.staticAttr = 'qux'
    Given -> Object.defineProperties Thing,
      secretStaticFunc:
        value: ->
        enumerable: false
        writable: true
    Given -> Object.defineProperties SuperThing.prototype,
      secretFunc:
        value: ->
        enumerable: false
        writable: true
    Given -> @fakeConstructor = td.constructor(Thing)
    Given -> @fakeInstance = new @fakeConstructor('pants')

    describe 'the constructor function itself', ->
      Then -> td.verify(new @fakeConstructor('pants'))

      describe 'stubbing it (with an error, return makes no sense)', ->
        Given -> td.when(new @fakeConstructor('!')).thenThrow('¡')
        Given -> @error = null
        When -> try new @fakeConstructor('!') catch e then @error = e
        Then -> @error == '¡'

    Then -> td.when(@fakeInstance.foo()).thenReturn(7)() == 7

    describe 'stub method on prototype, use from any instance', ->
      When -> td.when(@fakeConstructor.prototype.foo()).thenReturn(4)
      Then -> @fakeConstructor.prototype.foo() == 4
      Then -> @fakeInstance.foo() == 4

    # The static method can be stubbed
    Then -> td.when(@fakeConstructor.bar()).thenReturn(5)() == 5

    # Super type's methods can be stubbed, too
    Then -> td.when(@fakeInstance.biz()).thenReturn(6)() == 6

    # Things print OK
    Then -> @fakeConstructor.toString() == '[test double for "Thing"]'
    Then -> @fakeConstructor.prototype.foo.toString() == '[test double for "Thing.prototype.foo"]'
    Then -> @fakeConstructor.bar.toString() == '[test double for "Thing.bar"]'

    # Non-enumerables are covered
    Then -> td.explain(@fakeConstructor.secretStaticFunc).isTestDouble == true
    Then -> td.explain(@fakeInstance.secretFunc).isTestDouble == true

    # instanceof checks out
    Then -> @fakeInstance instanceof Thing

    # Original attributes are carried over
    Then -> @fakeConstructor.prototype.instanceAttr == 'baz'
    Then -> @fakeInstance.instanceAttr == 'baz'
    Then -> @fakeConstructor.staticAttr == 'qux'

  describe 'being given an array of function names', ->
    Given -> @fakeConstructor = td.constructor(['foo', 'bar'])
    Given -> @fakeInstance = new @fakeConstructor()
    Then -> @fakeConstructor.prototype.foo == @fakeInstance.foo
    And -> td.explain(@fakeInstance.foo).isTestDouble == true
    And -> td.explain(@fakeInstance.bar).isTestDouble == true
    And -> @fakeConstructor.toString() == '[test double constructor]'
    And -> @fakeInstance.toString() == '[test double instance of constructor]'
    And -> @fakeInstance.foo.toString() == '[test double for "#foo"]'

  describe 'edge case: being given a function without prototypal methods', ->
    Given -> @boringFunc = ->
    Given -> @boringFunc.foo = ->
    When -> @fakeFunc = td.constructor(@boringFunc)
    Then -> td.explain(@fakeFunc.foo).isTestDouble == true
