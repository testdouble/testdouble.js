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

    context 'inherited props too', ->
      Given -> @Thing = class Thing
      Given -> @Thing.staticFunc = ->
      Given -> @Thing.staticProp = 42
      Given -> @SubThing = class SubThing extends @Thing
      When -> @result = td.func(@SubThing)
      Then -> td.explain(@result.staticFunc).isTestDouble == true
      Then -> @result.staticProp == 42

    context 'non-enumerable props too', ->
      Given -> @func = ->
      Given -> Object.defineProperties @func,
        foo:
          value: ->
          enumerable: false
        bar:
          value: 42
          enumerable: false
      When -> @result = td.func(@func)
      Then -> td.explain(@result.foo).isTestDouble == true
      Then -> @result.bar == 42
