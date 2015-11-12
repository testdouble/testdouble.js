describe '.replace', ->
  Given -> @replace = requireSubject('lib/replace')

  describe 'creating a fake, returning it, and quibbling it into subject', ->
    Given -> @passenger = @replace('../fixtures/passenger')
    Given -> @car = require('../fixtures/car')
    Then -> @car.passenger == @passenger

    context 'double check that the test double works', ->
      Given -> @td = requireSubject()
      Given -> @td.when(@car.passenger.sit()).thenReturn('ow')
      When -> @result = @car.passenger.sit()
      Then -> @result == 'ow'


