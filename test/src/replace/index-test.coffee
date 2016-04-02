describe 'td.replace', ->

  describe 'Replacing properties on objects and restoring them with reset', ->
    Given -> @dependency =
      honk: -> 'og honk'
      dog:
        bark: -> 'og bark'
        woof: -> 'og woof'
        age: 18
      thingConstructor: class Thing
        foo: -> 'og foo'
        bar: -> 'og bar'

    describe 'Replacing a function', ->
      When -> @double = td.replace(@dependency, 'honk')
      Then -> td.explain(@double).isTestDouble == true
      And -> @double == @dependency.honk

      describe 'reset restores it', ->
        When -> td.reset()
        Then -> td.explain(@double).isTestDouble == false
        And -> @dependency.honk() == 'og honk'

    describe 'Replacing a constructor function', ->
      When -> @doubleBag = td.replace(@dependency, 'thingConstructor')
      Then -> td.explain(@doubleBag.foo).isTestDouble == true
      Then -> td.explain(@doubleBag.bar).isTestDouble == true
      And -> @doubleBag.foo == new @dependency.thingConstructor().foo
      And -> @doubleBag.bar == new @dependency.thingConstructor().bar

      describe 'reset restores it', ->
        When -> td.reset()
        Then -> td.explain(new @dependency.thingConstructor().foo).isTestDouble == false
        And -> new @dependency.thingConstructor().foo() == 'og foo'

    describe 'Replacing a method on an object instantiated with `new`', ->
      Given -> @thing = new @dependency.thingConstructor()
      When -> @doubleFoo = td.replace(@thing, 'foo')
      Then -> td.explain(@thing.foo).isTestDouble == true
      And -> @thing.foo() == undefined

      describe 'reset restores it', ->
        When -> td.reset()
        Then -> td.explain(@thing.foo).isTestDouble == false
        And -> @thing.foo() == 'og foo'

    describe 'Replacing an object / function bag', ->
      When -> @doubleBag = td.replace(@dependency, 'dog')
      Then -> td.explain(@doubleBag.bark).isTestDouble == true
      Then -> td.explain(@doubleBag.woof).isTestDouble == true
      And -> @doubleBag.bark == @dependency.dog.bark
      And -> @doubleBag.woof == @dependency.dog.woof
      And -> @doubleBag.age == 18

    describe 'Replacing a property that is not an object/function', ->
      Given -> @message = 'Error: testdouble.js - td.replace - "badType" property was found, but test double only knows how to replace functions, constructors, & objects containing functions (its value was '
      When -> try
          td.replace(@dependency, 'badType')
        catch e
          @error = e

      context 'a number', ->
        Given -> @dependency.badType = 5
        Then -> @error.message == @message + '5).'

      context 'a string', ->
        Given -> @dependency.badType = "hello"
        Then -> @error.message == @message + '"hello").'

      context 'null', ->
        Given -> @dependency.badType = null
        Then -> @error.message == @message + 'null).'

      context 'undefined', ->
        Given -> @dependency.badType = undefined
        Then -> @error.message == @message + 'undefined).'

    describe 'Replacing a non-existent property', ->
      context 'using automatic replacement', ->
        When -> try
            td.replace(@dependency, 'notAThing')
          catch e
            @error = e
        Then -> @error.message == 'Error: testdouble.js - td.replace - No "notAThing" property was found.'

      context 'with manual replacement', ->
        Given -> @myFake = td.replace(@dependency, 'notAThing', 'MY FAKE')
        Then -> @myFake == 'MY FAKE'
        And -> @myFake == @dependency.notAThing

        context 'is deleted following a reset', ->
          Given -> td.reset()
          Then -> @dependency.hasOwnProperty('notAThing') == false

    describe 'Manually specifying the override', ->
      Given -> @ogWarn = console.warn
      Given -> @warnings = []
      Given -> console.warn = (msg) => @warnings.push(msg)
      afterEach -> console.warn = @ogWarn

      context 'with a matching type', ->
        Given -> @originalHonk = @dependency.honk
        When -> @myDouble = td.replace(@dependency, 'honk', -> 'FAKE THING')
        Then -> @myDouble() == 'FAKE THING'
        And -> @myDouble == @dependency.honk
        And -> @warnings.length == 0

        context 'is restored following a reset', ->
          When -> td.reset()
          Then -> @dependency.honk == @originalHonk

      context 'with mismatched types', ->
        Given -> @dependency.lol = 5
        When -> td.replace(@dependency, 'lol', 'foo')
        Then -> @warnings[0] == "Warning: testdouble.js - td.replace - property \"lol\" 5 (Number) was replaced with \"foo\", which has a different type (String)."

      context 'where the actual is not defined', ->
        When -> td.replace(@dependency, 'naw', 'lol')
        Then -> @warnings.length == 0

  describe 'Node.js-specific module replacement', ->
    return unless NODE_JS

    Given -> @passenger = td.replace('../../fixtures/passenger') #<-- a constructor func
    Given -> @honk = td.replace('../../fixtures/honk') #<-- a plain ol' func
    Given -> @turn = td.replace('../../fixtures/turn') #<-- a named func
    Given -> @brake = td.replace('../../fixtures/brake', 'ANYTHING I WANT') #<-- a manual stub bc brake does not exist
    Given -> @lights = td.replace('../../fixtures/lights') #<- a plain object of funcs
    Given -> @car = require('../../fixtures/car')

    describe 'quibbling prototypal constructors get created with td.object(Type)', ->
      Given -> td.when(@passenger.sit()).thenReturn('ow')
      When -> @result = @car.seatPassenger()
      Then -> @result == 'ow'

    describe 'quibbling plain old functions with td.function()', ->
      Then -> @car.honk.toString() == "[test double for \"../../fixtures/honk\"]"

    describe 'naming the doubles of functions with names', ->
      Given -> td.when(@car.turn()).thenReturn('wee')
      Then -> @car.turn() == 'wee'
      And -> @car.turn.toString() == "[test double for \"turn\"]"

    describe 'manually stubbing an entry', ->
      Then -> @car.brake == 'ANYTHING I WANT'

    describe 'an object of funcs', ->
      Then -> @car.lights.headlight.toString() == '[test double for ".headlight"]'
      And -> @car.lights.turnSignal.toString() == '[test double for ".turnSignal"]'
      And -> @car.lights.count == 4
