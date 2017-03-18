describe 'getAllCustomPrototypalFunctionNames', ->
  Given -> @subject = require('../../../src/util/get-all-custom-prototypal-function-names').default

  describe 'a simple case', ->
    class Fruit
      quality: 66
      color: ->
      skin: ->
      nowImNotAFunction: ->
    class Banana extends Fruit
      age: 33
      peel: ->
      skin: ->
      nowImNotAFunction: 'lol'
    When -> @result = @subject(Banana)
    Then -> expect(@result).to.deep.eq(['peel', 'skin', 'color'])
