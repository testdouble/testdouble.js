return unless NODE_JS

describe 'args-match', ->
  Given -> @subject = requireSource('args-match')

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

