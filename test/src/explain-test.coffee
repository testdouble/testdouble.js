describe '.explain', ->
  Given -> @testDouble = td.function()
  When -> @result = td.explain(@testDouble)

  context 'a brand new test double', ->
    Then -> expect(@result).to.deep.eq
      calls: []
      callCount: 0
      description: """
      This test double has 0 stubbings and 0 invocations.
      """
      isTestDouble: true

  context 'a named test double', ->
    Given -> @testDouble = td.function("foobaby")
    Then -> expect(@result.description).to.deep.eq """
      This test double `foobaby` has 0 stubbings and 0 invocations.
      """

  context 'a double with some interactions', ->
    Given -> td.when(@testDouble(88)).thenReturn(5)
    Given -> td.when(@testDouble("two things!")).thenReturn("woah", "such")
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
      isTestDouble: true

  context 'a double with callback', ->
    Given -> td.when(@testDouble(14)).thenCallback(null, 8)
    Then -> expect(@result).to.deep.eq
      calls: []
      callCount: 0
      description: """
      This test double has 1 stubbings and 0 invocations.

      Stubbings:
        - when called with `(14, callback)`, then callback `(null, 8)`.
      """
      isTestDouble: true

  context 'a double with resolve', ->
    Given -> td.when(@testDouble(14)).thenResolve(8)
    Then -> expect(@result).to.deep.eq
      calls: []
      callCount: 0
      description: """
      This test double has 1 stubbings and 0 invocations.

      Stubbings:
        - when called with `(14)`, then resolve `8`.
      """
      isTestDouble: true

  context 'a double with reject', ->
    Given -> td.when(@testDouble(14)).thenReject(8)
    Then -> expect(@result).to.deep.eq
      calls: []
      callCount: 0
      description: """
      This test double has 1 stubbings and 0 invocations.

      Stubbings:
        - when called with `(14)`, then reject `8`.
      """
      isTestDouble: true

  context 'passed a non-test double', ->
    Given -> @testDouble = 42
    Then -> expect(@result).to.deep.eq
      calls: []
      callCount: 0
      description: "This is not a test double."
      isTestDouble: false
