describe '.explain', ->
  Given -> @explain = requireSubject('lib/explain')
  Given -> @create = requireSubject('lib/create')
  Given -> @when = requireSubject('lib/when')

  context 'a brand new test double', ->
    Given -> @testDouble = @create()
    When -> @result = @explain(@testDouble)
    Then -> expect(@result).to.deep.eq
      calls: []
      callCount: 0
      description: """
      This test double has 0 stubbings and 0 invocations.
      """
