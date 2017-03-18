describe 'store', ->
  Given -> @subject = require('../../../src/store').default

  describe '.onReset', ->
    Given -> @subject.onReset => @result = 'yay'
    When -> @subject.reset()
    Then -> @result == 'yay'

