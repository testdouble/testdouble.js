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
      # still constructable
      #
    describe 'Replacing an object / function bag', ->
      # age is still there
    describe 'Replacing a non-existent property', ->
      # raises error
    describe 'Manually specifying the override', ->
      # can literally be anything passed in

  describe 'Node.js-specific module replacement', ->
    return unless require('lodash').isFunction(require('quibble'))

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
