describe '.verify', ->
  Given -> @verify = requireSubject('lib/verify')
  Given -> @create = requireSubject('lib/create')
  Given -> @testDouble = @create()

  context 'a satisfied verification', ->
    When -> @testDouble("dogs", "cats")
    Then -> @verify(@testDouble("dogs", "cats"))

  context 'an unsatisfied verification - no interactions', ->
    Then -> shouldThrow (=> @verify(@testDouble("WOAH"))), """
      Unsatisfied test double verification.

        Wanted:
          - called with `("WOAH")`.

        But there were no invocations of the test double.
      """

  context 'unsatisfied verify - other interactions', ->
    When -> @testDouble("the wrong WOAH")
    Then -> shouldThrow (=> @verify(@testDouble("WOAH"))), """
      Unsatisfied test double verification.

        Wanted:
          - called with `("WOAH")`.

        But was actually called:
          - called with `("the wrong WOAH")`.
      """

  context 'a double-free verification', ->
    Then -> shouldThrow (=> @verify()), """
      No test double invocation call detected for `verify()`.

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

