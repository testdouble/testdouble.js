describe 'when', ->
  Given -> @testDouble = td.function()

  describe 'no-arg stubbing', ->
    context 'foo', ->
      Given -> td.when(@testDouble()).thenReturn("foo")
      Then -> @testDouble() == "foo"
    context 'bar', ->
      Given -> td.when(@testDouble()).thenReturn("bar")
      Then -> @testDouble() == "bar"

  describe 'last-in-wins overwriting', ->
    Given -> td.when(@testDouble("something")).thenReturn("gold")
    Given -> td.when(@testDouble("something")).thenReturn("iron")
    Then -> @testDouble("something") == "iron"

  describe 'conditional stubbing', ->
    Given -> td.when(@testDouble(1)).thenReturn("foo")
    Given -> td.when(@testDouble(2)).thenReturn("bar")
    Given -> td.when(@testDouble(lol: 'cheese')).thenReturn('nom')
    Given -> td.when(@testDouble(lol: 'fungus')).thenReturn('eww')
    Given -> td.when(@testDouble({lol: 'fungus'}, 2)).thenReturn('eww2')
    Then -> @testDouble() == undefined
    And -> @testDouble(1) == "foo"
    And -> @testDouble(2) == "bar"
    And -> @testDouble(lol: 'cheese') == "nom"
    And -> @testDouble(lol: 'fungus') == "eww"
    And -> @testDouble({lol: 'fungus'}, 2) == "eww2"

  describe 'multiple test doubles', ->
    Given -> @td1 = td.when(td.function()()).thenReturn("lol1")
    Given -> @td2 = td.when(td.function()()).thenReturn("lol2")
    Then -> @td1() == "lol1"
    Then -> @td2() == "lol2"

  describe 'using matchers', ->
    Given -> td.when(@testDouble(88, td.matchers.isA(Number))).thenReturn("yay")
    Then -> @testDouble(88, 5) == "yay"
    Then -> @testDouble(44, 5) == undefined
    Then -> @testDouble(88, "five") == undefined

  describe 'stubbing sequential returns', ->
    context 'a single stubbing', ->
      Given -> td.when(@testDouble()).thenReturn(10,9)
      When -> [@first, @second, @third] = [@testDouble(), @testDouble(), @testDouble()]
      Then -> @first == 10
      Then -> @second == 9
      Then -> @third == 9 #<-- last one repeats

    context 'two overlapping stubbings', ->
      Given -> td.when(@testDouble()).thenReturn('A')
      Given -> @testDouble() #<-- returns A, td's callCount will be 1
      Given -> td.when(@testDouble()).thenReturn('B', 'C')
      Then -> @testDouble() == 'B'

  describe 'stubbing actions with `thenDo` instead of `thenReturn`', ->
    Given -> @someAction = td.when(td.function()(55)).thenReturn('yatta')
    Given -> td.when(@testDouble(55)).thenDo(@someAction)
    When -> @result = @testDouble(55)
    And -> @result == 'yatta'

  describe 'stubbing actions with `thenThrow` instead of `thenReturn`', ->
    Given -> @error = new Error('lol')
    Given -> td.when(@testDouble(42)).thenThrow(@error)
    When -> try @testDouble(42) catch e then @result = e
    Then -> @error == @result

  describe 'stubbing promises', ->
    context 'with a native promise', ->
      return unless typeof Promise == 'function'

      describe 'td.when…thenResolve', ->
        Given -> td.when(@testDouble(10)).thenResolve('pants')
        When (done) -> @testDouble(10).then((@resolved) => done())
        Then -> @resolved == 'pants'

      describe 'td.when…thenReject', ->
        Given -> td.when(@testDouble(10)).thenReject('oops')
        When (done) -> @testDouble(10).then null, (@rejected) => done()
        Then -> @rejected == 'oops'

    context 'with an alternative promise constructor', ->
      class FakePromise
        constructor: (executor) ->
          executor(((@resolved) =>), ((@rejected) =>))

        then: (success, failure) ->
          if @resolved?
            success(@resolved + '!')
          else
            failure(@rejected + '?')

      Given -> td.config({promiseConstructor: FakePromise})
      describe 'td.when…thenResolve', ->
        Given -> td.when(@testDouble(10)).thenResolve('pants')
        When (done) -> @testDouble(10).then((@resolved) => done())
        Then -> @resolved == 'pants!'

      describe 'td.when…thenReject', ->
        Given -> td.when(@testDouble(10)).thenReject('oops')
        When (done) -> @testDouble(10).then null, (@rejected) => done()
        Then -> @rejected == 'oops?'

    context 'with no promise constructor', ->
      Given -> @warnings = []
      Given -> @errors = []
      Given -> console.warn = (m) => @warnings.push(m)
      Given -> console.error = (m) => @errors.push(m)
      Given -> td.config({promiseConstructor: undefined})

      describe 'td.when…thenResolve', ->
        Given -> td.when(@testDouble(10)).thenResolve('pants')
        Then -> @warnings[0] == """
          Warning: testdouble.js - td.when - no promise constructor is set, so this `thenResolve` or `thenReject` stubbing
          will fail if it's satisfied by an invocation on the test double. You can tell
          testdouble.js which promise constructor to use with `td.config`, like so:

            td.config({
              promiseConstructor: require('bluebird')
            })
          """

        describe 'actually invoking it', ->
          When -> try @testDouble(10) catch e then @error = e
          Then -> @error.message == """
              Error: testdouble.js - td.when - no promise constructor is set (perhaps this runtime lacks a native Promise
              function?), which means this stubbing can't return a promise to your
              subject under test, resulting in this error. To resolve the issue, set
              a promise constructor with `td.config`, like this:

                td.config({
                  promiseConstructor: require('bluebird')
                })
            """

  describe 'stubbing error, no invocation found', ->
    Given -> td.reset()
    Given -> try
        td.when().thenReturn('hi')
      catch e
        @error = e
    Then -> @error.message == """
      Error: testdouble.js - td.when - No test double invocation call detected for `when()`.

        Usage:
          when(myTestDouble('foo')).thenReturn('bar')
      """

  describe 'config object', ->
    describe 'ignoring extra arguments', ->
      context 'for a no-arg stubbing', ->
        Given -> td.when(@testDouble(), ignoreExtraArgs: true).thenReturn('pewpew')
        When -> @result = @testDouble('so', 'many', 'args')
        Then -> @result == 'pewpew'

      context 'when an initial-arg-matters', ->
        Given -> td.when(@testDouble('important'), ignoreExtraArgs: true).thenReturn('neat')

        context 'satisfied without extra args', ->
          Then -> @testDouble('important') == 'neat'

        context 'satisfied with extra args', ->
          Then -> @testDouble('important', 'not important') == 'neat'

        context 'unsatisfied with no args', ->
          Then -> @testDouble() == undefined

        context 'unsatisfied with extra args', ->
          Then -> @testDouble('unimportant', 'not important') == undefined

    describe 'limiting times stubbing will work', ->
      context 'a single stub', ->
        Given -> td.when(@testDouble(), times: 2).thenReturn('pants')
        When -> @result = [@testDouble(), @testDouble(), @testDouble()]
        Then -> expect(@result).to.deep.equal(['pants', 'pants', undefined])

      context 'two overlapping stubbings', ->
        Given -> td.when(@testDouble()).thenReturn('NO')
        Given -> td.when(@testDouble(), times: 1).thenReturn('YES')
        When -> @result = [@testDouble(), @testDouble(), @testDouble()]
        Then -> expect(@result).to.deep.equal(['YES', 'NO', 'NO'])

  describe 'nested whens', ->
    Given -> @knob = td.function()
    Given -> @door = td.function()
    Given -> td.when(@knob('twist')).thenReturn
      door: td.when(@door('push')).thenReturn('open')
    When -> @result = @knob('twist').door('push')
    Then -> @result == 'open'
