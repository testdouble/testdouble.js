describe 'testdouble.object', ->
  Given -> @subject = requireSubject('lib/object')
  Given -> @when = requireSubject('lib/when')
  Given -> @verify = requireSubject('lib/verify')

  describe 'making a test double object based on a Prototypal thing', ->
    Given -> @someType = class Thing
      foo: ->
      bar: ->
    Given -> @testDouble = @subject(@someType)
    When -> @when(@testDouble.bar()).thenReturn('yay')
    Then -> @testDouble.bar() == 'yay'
    And -> @testDouble.toString() == '[test double object for "Thing"]'
    And -> @testDouble.foo.toString() == '[test double for "Thing#foo"]'

  if global.Proxy?
    describe 'creating a proxy object (ES2015; only supported in FF + Edge atm)', ->
      Given -> @testDouble = @subject('Thing')
      Given -> @testDouble.magic('sauce')
      When -> @when(@testDouble.whateverYouWant()).thenReturn('YESS')
      Then -> @verify(@testDouble.magic('sauce'))
      And -> @testDouble.whateverYouWant() == 'YESS'
      And -> @testDouble.toString() == '[test double object for "Thing"]'
      And -> @testDouble.foo.toString() == '[test double for "Thing#foo"]'

      context 'with custom excludeMethods definitions', ->
        Given -> @testDouble = @subject('Stuff', excludeMethods: ['then', 'fun'])
        Then -> @testDouble.fun == undefined

      context 'unnamed double', ->
        Given -> @testDouble = @subject()
        Then -> @testDouble.toString() == '[test double object]'
        Then -> @testDouble.lol.toString() == '[test double for "#lol"]'
