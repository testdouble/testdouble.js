describe '.replace', ->
  Given -> @td = requireSubject()
  Given -> @replace = requireSubject('lib/replace')

  describe 'creating a fake, returning it, and quibbling it into subject', ->
    Given -> @passenger = @replace('../fixtures/passenger') #<-- a constructor func
    Given -> @honk = @replace('../fixtures/honk') #<-- a plain ol' func
    Given -> @brake = @replace('../fixtures/brake', @td.function('brake')) #<-- a manual stub bc brake does not exist
    Given -> @car = require('../fixtures/car')
    Then -> @car.passenger == @passenger

    describe 'quibbling prototypal constructors get created with td.object(Type)', ->
      Given -> @td.when(@car.passenger.sit()).thenReturn('ow')
      When -> @result = @car.passenger.sit()
      Then -> @result == 'ow'


