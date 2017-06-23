describe 'td.object', ->
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

  describe 'creating an object that is an instance of a prototypal thing', ->
    Given -> @type = class Thing
      foo: -> 'bar'
    When -> @testDouble = td.object(new @type())
    Then -> td.explain(@testDouble.foo).isTestDouble == true

  describe 'making a test double based on an array of strings', ->
    Given -> @testDouble = td.object(['biz','bam','boo'])
    When -> td.when(@testDouble.biz()).thenReturn('zing!')
    Then -> @testDouble.biz() == 'zing!'
    And -> @testDouble.toString() == '[test double object]'
    And -> @testDouble.bam.toString() == '[test double for ".bam"]'

  describe 'passing a function to td.object erroneously (1.x)', ->
    When -> try td.object(->) catch e then @result = e
    Then -> expect(@result.message).to.contain(
      "Please use `td.function()` or `td.constructor()` instead")

  describe 'passing an Object.create()d thing', ->
    When -> @testDouble = td.object(Object.create(respond: -> 'no'))
    Then -> td.explain(@testDouble.respond).isTestDouble == true

  if global.Proxy?
    describe 'creating a proxy object (ES2015; only supported in FF + Edge atm)', ->
      Given -> @testDouble = td.object('thing')
      Given -> @testDouble.magic('sauce')
      When -> td.when(@testDouble.whateverYouWant()).thenReturn('YESS')
      Then -> td.verify(@testDouble.magic('sauce'))
      And -> @testDouble.whateverYouWant() == 'YESS'
      And -> @testDouble.toString() == '[test double object for "thing"]'
      And -> @testDouble.foo.toString() == '[test double for "thing.foo"]'

      context 'with custom excludeMethods definitions', ->
        Given -> @testDouble = td.object('Stuff', excludeMethods: ['then', 'fun'])
        Then -> @testDouble.fun == undefined

      context 'unnamed double', ->
        Given -> @testDouble = td.object()
        Then -> @testDouble.toString() == '[test double object]'
        Then -> @testDouble.lol.toString() == '[test double for ".lol"]'
  else
    describe 'getting an error message', ->
      When -> try
          td.object('Woah')
        catch error
          @error = error
      Then -> @error.message == """
        Error: testdouble.js - td.object - The current runtime does not have Proxy support, which is what
        testdouble.js depends on when a string name is passed to `td.object()`.

        More details here:
          https://github.com/testdouble/testdouble.js/blob/master/docs/4-creating-test-doubles.md#objectobjectname

        Did you mean `td.object(['Woah'])`?
      """
