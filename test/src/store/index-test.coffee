return unless NODE_JS

describe 'store', ->
  Given -> @subject = requireSource('store/index')

  describe '.onReset', ->
    Given -> @subject.onReset => @result = 'yay'
    When -> @subject.reset()
    Then -> @result == 'yay'

