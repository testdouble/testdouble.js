describe 'args-match', ->
  Given -> @subject = require('../../src/args-match').default

  context 'allow matchers', ->
    When -> @result =  @subject([td.matchers.anything()], [5])
    Then -> @result == true

  context 'disallow matchers', ->
    context 'matches', ->
      When -> @result =  @subject([td.matchers.anything()], [5], {allowMatchers: false})
      Then -> @result == false

    context 'exact', ->
      When -> @result =  @subject([5], [5], {allowMatchers: false})
      Then -> @result == true

