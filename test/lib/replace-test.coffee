describe '.replace', ->
  Given -> @td = requireSubject()
  Given -> @replace = requireSubject('lib/replace')

  describe 'creating a fake, returning it, and quibbling it into subject', ->
    Given -> @passenger = @replace('../fixtures/passenger') #<-- a constructor func
    Given -> @honk = @replace('../fixtures/honk') #<-- a plain ol' func
    Given -> @turn = @replace('../fixtures/turn') #<-- a named func
    Given -> @brake = @replace('../fixtures/brake', 'ANYTHING I WANT') #<-- a manual stub bc brake does not exist
    Given -> @car = require('../fixtures/car')
    Then -> @car.passenger == @passenger

    describe 'quibbling prototypal constructors get created with td.object(Type)', ->
      Given -> @td.when(@car.passenger.sit()).thenReturn('ow')
      When -> @result = @car.passenger.sit()
      Then -> @result == 'ow'

    describe 'quibbling plain old functions with td.function()', ->
      Then -> @car.honk.toString() == "[test double for \"../fixtures/honk\"]"

    describe 'naming the doubles of functions with names', ->
      Given -> @td.when(@car.turn()).thenReturn('wee')
      Then -> @car.turn() == 'wee'
      And -> @car.turn.toString() == "[test double for \"turn\"]"

    describe 'manually stubbing an entry', ->
      Then -> @car.brake == 'ANYTHING I WANT'
