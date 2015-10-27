describe '.explain', ->
  Given -> @explain = requireSubject('lib/explain')
  Given -> @function = requireSubject('lib/function')
  Given -> @when = requireSubject('lib/when')

  Given -> @testDouble = @function()
  When -> @result = @explain(@testDouble)

  context 'a brand new test double', ->
    Then -> expect(@result).to.deep.eq
      calls: []
      callCount: 0
      description: """
      This test double has 0 stubbings and 0 invocations.
      """

  context 'a named test double', ->
    Given -> @testDouble = @function("foobaby")
    Then -> expect(@result.description).to.deep.eq """
      This test double `foobaby` has 0 stubbings and 0 invocations.
      """

  context 'a double with some interactions', ->
    Given -> @when(@testDouble(88)).thenReturn(5)
    Given -> @when(@testDouble("two things!")).thenReturn("woah", "such")
    Given -> @testDouble(88)
    Given -> @testDouble("not 88", 44)

    Then -> expect(@result).to.deep.eq
      calls: [
        {context: this, args: [88]},
        {context: this, args: ["not 88", 44]}
      ]
      callCount: 2
      description: """
      This test double has 2 stubbings and 2 invocations.

      Stubbings:
        - when called with `(88)`, then return `5`.
        - when called with `("two things!")`, then return `"woah"`, then `"such"`.

      Invocations:
        - called with `(88)`.
        - called with `("not 88", 44)`.
      """
