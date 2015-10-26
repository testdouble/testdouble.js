describe '.verify', ->
  Given -> @verify = requireSubject('lib/verify')
  Given -> @function = requireSubject('lib/function')
  Given -> @object = requireSubject('lib/object')
  Given -> @testDouble = @function()

  context 'a satisfied verification', ->
    When -> @testDouble("dogs", "cats")
    Then -> @verify(@testDouble("dogs", "cats"))

  context 'an unsatisfied verification - no interactions', ->
    Then -> shouldThrow (=> @verify(@testDouble("WOAH"))), """
      Unsatisfied verification on test double.

        Wanted:
          - called with `("WOAH")`.

        But there were no invocations of the test double.
      """

  context 'unsatisfied verify - other interactions', ->
    When -> @testDouble("the wrong WOAH")
    Then -> shouldThrow (=> @verify(@testDouble("WOAH"))), """
      Unsatisfied verification on test double.

        Wanted:
          - called with `("WOAH")`.

        But was actually called:
          - called with `("the wrong WOAH")`.
      """

  context 'unsatisfied verify - wrong arg count', ->
    When -> @testDouble("good", "bad")
    Then -> shouldThrow (=> @verify(@testDouble("good"))), """
      Unsatisfied verification on test double.

        Wanted:
          - called with `("good")`.

        But was actually called:
          - called with `("good", "bad")`.
      """

  context 'with a named double', ->
    Given -> @testDouble = @function("#footime")
    When -> @result = (shouldThrow => @verify(@testDouble()))
    Then -> expect(@result).to.contain("verification on test double `#footime`.")

  context 'with a prototype-modeling double', ->
    Given -> @SomeType = `function Foo() {}`
    Given -> @SomeType::bar = ->
    Given -> @SomeType::baz = ->
    Given -> @SomeType::biz = "not a function!"
    Given -> @testDoubleObj = @object(@SomeType)
    When -> @result = (shouldThrow => @verify(@testDoubleObj.baz()))
    Then -> expect(@result).to.contain("verification on test double `Foo#baz`.")
    Then -> @testDoubleObj.biz == "not a function!"

  context 'with a test double *as an arg* to another', ->
    Given -> @testDouble = @function()
    When -> @result = (shouldThrow => @verify(@testDouble(@someTestDoubleArg)))

    context 'with an unnamed double _as an arg_', ->
      Given -> @someTestDoubleArg = @function()
      Then -> expect(@result).to.contain("- called with `([test double (unnamed)])`.")

    context 'with a named double _as an arg_', ->
      Given -> @someTestDoubleArg = @function("#foo")
      Then -> expect(@result).to.contain("- called with `([test double for \"#foo\"])`.")

  context 'a double-free verification error', ->
    Then -> shouldThrow (=> @verify()), """
      No test double invocation detected for `verify()`.

        Usage:
          verify(myTestDouble('foo'))
      """

  context 'using matchers', ->
    Given -> @matchers = requireSubject('lib/matchers')
    When -> @testDouble(55)

    context 'satisfied', ->
      Then -> shouldNotThrow(=> @verify(@testDouble(@matchers.isA(Number))))

    context 'unsatisfied', ->
      Then -> shouldThrow(=> @verify(@testDouble(@matchers.isA(String))))

  describe 'configuration', ->

    describe 'ignoring extra arguments (more thoroughly tested via when())', ->
      When -> @testDouble('matters', 'not')
      Then -> shouldNotThrow(=> @verify(@testDouble('matters'), ignoreExtraArgs: true))

    describe 'number of times an invocation is satisfied', ->
      context '0 times, satisfied', ->
        Then -> shouldNotThrow(=> @verify(@testDouble(), times: 0))

      context '0 times, unsatisfied', ->
        When -> @testDouble()
        Then -> shouldThrow (=> @verify(@testDouble(), times: 0)), """
          Unsatisfied verification on test double.

            Wanted:
              - called with `()` 0 times.

            But was actually called:
              - called with `()`.
          """

      context '1 time, satisfied', ->
        When -> @testDouble()
        Then -> shouldNotThrow(=> @verify(@testDouble(), times: 1))

      context '1 time, unsatisfied (with 2)', ->
        When -> @testDouble()
        And -> @testDouble()
        Then -> shouldThrow (=> @verify(@testDouble(), times: 1)), """
          Unsatisfied verification on test double.

            Wanted:
              - called with `()` 1 time.

            But was actually called:
              - called with `()`.
              - called with `()`.
          """

      context '4 times, satisfied', ->
        When -> @testDouble()
        And -> @testDouble()
        And -> @testDouble()
        And -> @testDouble()
        Then -> shouldNotThrow(=> @verify(@testDouble(), times: 4))

      context '4 times, unsatisfied (with 3)', ->
        When -> @testDouble()
        And -> @testDouble()
        And -> @testDouble()
        Then -> shouldThrow (=> @verify(@testDouble(), times: 4)), """
          Unsatisfied verification on test double.

            Wanted:
              - called with `()` 4 times.

            But was actually called:
              - called with `()`.
              - called with `()`.
              - called with `()`.
          """





