describe 'td.object', ->
  describe 'making a test double object based on a Prototypal thing', ->
    Given -> @someType = class Thing
      foo: ->
      bar: ->
      notAFunc: 11
    Given -> @testDouble = td.object(@someType)
    When -> td.when(@testDouble.bar()).thenReturn('yay')
    Then -> @testDouble.bar() == 'yay'
    And -> @testDouble.toString() == '[test double object for "Thing"]'
    And -> @testDouble.foo.toString() == '[test double for "Thing#foo"]'
    And -> @testDouble.notAFunc == 11

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
