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

shouldThrow = (func, message) ->
  threw = null
  try
    func()
    threw = false
  catch e
    expect(e.message).to.eq(message)
    threw = true
  expect(threw, "Expected function to throw an error").to.be.true

