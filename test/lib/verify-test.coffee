describe '.verify', ->
  Given -> @verify = requireSubject('lib/verify')
  Given -> @create = requireSubject('lib/create')
  Given -> @testDouble = @create()

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

  context 'with a named double', ->
    Given -> @testDouble = @create("#footime")
    When -> @result = (shouldThrow => @verify(@testDouble()))
    Then -> expect(@result).to.contain("verification on test double `#footime`.")

  context 'with a prototype-modeling double', ->
    Given -> @SomeType = `function Foo() {}`
    Given -> @SomeType::bar = ->
    Given -> @SomeType::baz = ->
    Given -> @SomeType::biz = "not a function!"
    Given -> @testDoubleObj = @create(@SomeType)
    When -> @result = (shouldThrow => @verify(@testDoubleObj.baz()))
    Then -> expect(@result).to.contain("verification on test double `Foo#baz`.")
    Then -> @testDoubleObj.biz == "not a function!"

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

