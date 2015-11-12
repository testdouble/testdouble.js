describe '.replace', ->
  Given -> @replace = requireSubject('lib/replace')

  describe 'creating a fake, returning it, and quibbling it into subject', ->
    Given -> @passenger = @replace('../fixtures/passenger')
    Given -> @car = require('../fixtures/car')
    Then -> @car.passenger == @passenger
    #And -> td.explain(@car.passenger.sit) == 'h'


