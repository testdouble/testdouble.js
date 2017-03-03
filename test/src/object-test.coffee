describe 'td.object', ->
  describe.only 'making a test double object based on a Prototypal thing', ->
    Thing = SuperThing = null
    Given -> class SuperThing
      biz: -> 1
    Given -> class Thing extends SuperThing
    Given -> Thing::foo = -> 2
    Given -> Thing.bar = -> 3
    Given -> Thing::instanceAttr = 'baz'
    Given -> Thing.staticAttr = 'qux'
    Given -> @fakeType = td.object(Thing)
    Given -> @fakeInstance = new @fakeType('pants')

    # The constructor can be verified
    # ### but like how…
    #Then -> td.verify(@fakeType('pants'))

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

  describe 'making a test double based on a plain object funcbag', ->
    Given -> @funcBag =
      lol: ->
      kek: ->
      now: ->
      otherThing: 8
    Given -> @testDouble = td.object(@funcBag)
    When -> td.when(@testDouble.kek()).thenReturn('nay!')
    Then -> @testDouble.kek() == 'nay!'
    And -> @testDouble.toString() == '[test double object]'
    And -> @testDouble.now.toString() == '[test double for ".now"]'
    And -> @testDouble.otherThing == 8

  describe 'making a test double based on an array of strings', ->
    Given -> @testDouble = td.object(['biz','bam','boo'])
    When -> td.when(@testDouble.biz()).thenReturn('zing!')
    Then -> @testDouble.biz() == 'zing!'
    And -> @testDouble.toString() == '[test double object]'
    And -> @testDouble.bam.toString() == '[test double for ".bam"]'

  describe 'making a test double on a subtype', ->
    Given -> @someSuperType = class SuperType
      foo: ->
    Given -> @someSubType = class SubType extends @someSuperType
      bar: ->
    Given -> @testDouble = td.object(@someSubType)
    When -> td.when(@testDouble.foo()).thenReturn('yay')
    When -> td.when(@testDouble.bar()).thenReturn('yay')
    Then -> @testDouble.foo() == 'yay'
    Then -> @testDouble.bar() == 'yay'

  if global.Proxy?
    describe 'creating a proxy object (ES2015; only supported in FF + Edge atm)', ->
      Given -> @testDouble = td.object('Thing')
      Given -> @testDouble.magic('sauce')
      When -> td.when(@testDouble.whateverYouWant()).thenReturn('YESS')
      Then -> td.verify(@testDouble.magic('sauce'))
      And -> @testDouble.whateverYouWant() == 'YESS'
      And -> @testDouble.toString() == '[test double object for "Thing"]'
      And -> @testDouble.foo.toString() == '[test double for "Thing#foo"]'

      context 'with custom excludeMethods definitions', ->
        Given -> @testDouble = td.object('Stuff', excludeMethods: ['then', 'fun'])
        Then -> @testDouble.fun == undefined

      context 'unnamed double', ->
        Given -> @testDouble = td.object()
        Then -> @testDouble.toString() == '[test double object]'
        Then -> @testDouble.lol.toString() == '[test double for "#lol"]'
  else
    describe 'getting an error message', ->
      When -> try
          td.object('Woah')
        catch error
          @error = error
      Then -> @error.message == """
        The current runtime does not have Proxy support, which is what
        testdouble.js depends on when a string name is passed to `td.object()`.

        More details here:
          https://github.com/testdouble/testdouble.js/blob/master/docs/4-creating-test-doubles.md#objectobjectname

        Did you mean `td.object(['Woah'])`?
      """
