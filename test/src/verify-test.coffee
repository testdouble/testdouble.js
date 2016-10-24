describe '.verify', ->
  Given -> @testDouble = td.function()

  context 'a satisfied verification', ->
    When -> @testDouble("dogs", "cats")
    Then -> td.verify(@testDouble("dogs", "cats"))

  context 'an unsatisfied verification - no interactions', ->
    Given -> @arg = joe: 5, jill: [1,'2',3]
    Given -> @arg.circ = @arg
    Then -> shouldThrow (=> td.verify(@testDouble("WOAH", @arg))), """
      Unsatisfied verification on test double.

        Wanted:
          - called with `("WOAH", {joe: 5, jill: [1, "2", 3], circ: "[Circular]"})`.

        But there were no invocations of the test double.
      """

  context 'unsatisfied verify - other interactions', ->
    When -> @testDouble("the wrong WOAH")
    Then -> shouldThrow (=> td.verify(@testDouble("WOAH"))), """
      Unsatisfied verification on test double.

        Wanted:
          - called with `("WOAH")`.

        But was actually called:
          - called with `("the wrong WOAH")`.
      """

  context 'unsatisfied verify - wrong arg count', ->
    When -> @testDouble("good", "bad")
    Then -> shouldThrow (=> td.verify(@testDouble("good"))), """
      Unsatisfied verification on test double.

        Wanted:
          - called with `("good")`.

        But was actually called:
          - called with `("good", "bad")`.
      """

  context 'unsatisfied verify - wrong arg count with ignored args', ->
    When -> @testDouble("good", "bad", "more", "args")
    Then -> shouldThrow (=> td.verify(@testDouble("good", "gooder"), {ignoreExtraArgs: true})), """
      Unsatisfied verification on test double.

        Wanted:
          - called with `("good", "gooder")`, ignoring any additional arguments.

        But was actually called:
          - called with `("good", "bad", "more", "args")`.
      """

  context 'with a named double', ->
    Given -> @testDouble = td.function("#footime")
    When -> @result = (shouldThrow => td.verify(@testDouble()))
    Then -> expect(@result).to.contain("verification on test double `#footime`.")

  context 'with a prototype-modeling double', ->
    Given -> @SomeType = `function Foo() {}`
    Given -> @SomeType::bar = ->
    Given -> @SomeType::baz = ->
    Given -> @SomeType::biz = "not a function!"
    Given -> @testDoubleObj = td.object(@SomeType)
    When -> @result = (shouldThrow => td.verify(@testDoubleObj.baz()))
    Then -> expect(@result).to.contain("verification on test double `Foo#baz`.")
    Then -> @testDoubleObj.biz == "not a function!"

  context 'with a test double *as an arg* to another', ->
    Given -> @testDouble = td.function()
    When -> @result = (shouldThrow => td.verify(@testDouble(@someTestDoubleArg)))

    context 'with an unnamed double _as an arg_', ->
      Given -> @someTestDoubleArg = td.function()
      Then -> expect(@result).to.contain("- called with `([test double (unnamed)])`.")

    context 'with a named double _as an arg_', ->
      Given -> @someTestDoubleArg = td.function("#foo")
      Then -> expect(@result).to.contain("- called with `([test double for \"#foo\"])`.")

  context 'a double-free verification error', ->
    Then -> shouldThrow (=> td.verify()), """
      Error: testdouble.js - td.verify - No test double invocation detected for `verify()`.

        Usage:
          verify(myTestDouble('foo'))
      """

  context 'using matchers', ->
    When -> @testDouble(55)

    context 'satisfied', ->
      Then -> shouldNotThrow(=> td.verify(@testDouble(td.matchers.isA(Number))))

    context 'unsatisfied', ->
      Then -> shouldThrow (=> td.verify(@testDouble(td.matchers.isA(String)))), """
      Unsatisfied verification on test double.

        Wanted:
          - called with `(isA(String))`.

        But was actually called:
          - called with `(55)`.
      """

  describe 'configuration', ->

    describe 'ignoring extra arguments (more thoroughly tested via when())', ->
      When -> @testDouble('matters', 'not')
      Then -> shouldNotThrow(=> td.verify(@testDouble('matters'), ignoreExtraArgs: true))

    describe 'number of times an invocation is satisfied', ->
      context '0 times, satisfied', ->
        Then -> shouldNotThrow(=> td.verify(@testDouble(), times: 0))

      context '0 times, unsatisfied', ->
        When -> @testDouble()
        Then -> shouldThrow (=> td.verify(@testDouble(), times: 0)), """
          Unsatisfied verification on test double.

            Wanted:
              - called with `()` 0 times.

            But was actually called:
              - called with `()`.
          """

      context '1 time, satisfied', ->
        When -> @testDouble()
        Then -> shouldNotThrow(=> td.verify(@testDouble(), times: 1))

      context '1 time, unsatisfied (with 2)', ->
        When -> @testDouble()
        And -> @testDouble()
        Then -> shouldThrow (=> td.verify(@testDouble(), times: 1)), """
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
        Then -> shouldNotThrow(=> td.verify(@testDouble(), times: 4))

      context '4 times, unsatisfied (with 3)', ->
        When -> @testDouble()
        And -> @testDouble()
        And -> @testDouble()
        Then -> shouldThrow (=> td.verify(@testDouble(), times: 4)), """
          Unsatisfied verification on test double.

            Wanted:
              - called with `()` 4 times.

            But was actually called:
              - called with `()`.
              - called with `()`.
              - called with `()`.
          """

  describe 'warning when verifying a stubbed invocation', ->
    Given -> @ogWarn = console.warn
    Given -> @warnings = []
    Given -> console.warn = (msg) => @warnings.push(msg)
    afterEach = console.warn = @ogWarn
    Given -> @td = td.function('.foo')

    context 'an exact match in calls', ->
      Given -> td.when(@td(1)).thenReturn(5)
      Given -> @td(1)
      When -> td.verify(@td(1))
      Then -> @warnings[0] == """
        Warning: testdouble.js - td.verify - test double `.foo` was both stubbed and verified with arguments (1), which is redundant and probably unnecessary. (see: https://github.com/testdouble/testdouble.js/blob/master/docs/B-frequently-asked-questions.md#why-shouldnt-i-call-both-tdwhen-and-tdverify-for-a-single-interaction-with-a-test-double )
        """

    context 'matchers are used', ->
      Given -> td.when(@td(td.matchers.isA(Number))).thenReturn(5)
      Given -> @td(1)
      When -> td.verify(@td(1))
      Then -> @warnings.length == 0

