describe 'store', ->
  return unless NODE_JS
  Given -> @subject = requireSource('store/index')

  describe '.onReset', ->
    Given -> @subject.onReset => @result = 'yay'
    When -> @subject.reset()
    Then -> @result == 'yay'

