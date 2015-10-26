describe 'testdouble.object', ->
  Given -> @subject = requireSubject('lib/object')
  Given -> @when = requireSubject('lib/when')

  xdescribe 'making a test double object based on a Prototypal thing', ->
    Given -> @someType = class Thing
      foo: ->
      bar: ->
    Given -> @testDouble = @subject(@someType)
    When -> @when(@testDouble.bar()).thenReturn('yay')
    Then -> @testDouble.bar() == 'yay'
    And -> @testDouble.toString() == '[test double object (Thing)]'
    And -> @testDouble.foo.toString() == '[test double (Thing#foo)]'

  if global.Proxy?
    describe 'creating a proxy object (ES2015; only supported in FF + Edge atm)', ->
      Given -> @testDouble = @subject('Thing')
      When -> @when(@testDouble.whateverYouWant()).thenReturn('YESS')
      Then -> @testDouble.whateverYouWant() == 'YESS'
      And -> @testDouble.toString() == '[test double object (Thing)]'
      And -> @testDouble.foo.toString() == '[test double (Thing#foo)]'

