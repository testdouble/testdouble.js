describe 'td.function', ->
  context '.toString', ->
    Then -> td.function('boo!').toString() == '[test double for "boo!"]'
    Then -> td.function().toString() == '[test double (unnamed)]'
    Then -> td.function(->).toString() == '[test double (unnamed)]'
    Then -> td.function(class Lol).toString() == '[test double for "Lol"]'

  context 'copying properties on functions', ->
    Given -> @func = ->
    Given -> @func.foo = ->
    Given -> @func.bar = 42
    When -> @result = td.function(@func)
    Then -> @result.toString() == '[test double (unnamed)]'
    Then -> @result.foo.toString() == '[test double for ".foo"]'
    Then -> @result.bar == 42


