let testDouble, result
module.exports = {
    beforeEach() {
        testDouble = td.function()
    },
    'a brand new test double'() {
        result = td.explain(testDouble)

        assert._isEqual(result, {
            name: undefined,
            calls: [],
            callCount: 0,
            description: 'This test double has 0 stubbings and 0 invocations.',
            isTestDouble: true
        })
    },
    'a named test double'() {
        testDouble = td.function('foobaby')

        result = td.explain(testDouble)

        assert._isEqual(result.description, 'This test double `foobaby` has 0 stubbings and 0 invocations.')
        assert._isEqual(result.name, 'foobaby')
    },
    'a double with some interactions'() {
        td.when(testDouble(88)).thenReturn(5)
        td.when(testDouble('two things!')).thenReturn('woah', 'such')
        testDouble.call('lol', 88)
        testDouble.call('woo', 'not 88', 44)

        result = td.explain(testDouble)

        assert._isEqual(result, {
            name: undefined,
            calls: [
                {context: 'lol', args: [88]},
                {context: 'woo', args: ['not 88', 44]}
            ],
            callCount: 2,
            description: `This test double has 2 stubbings and 2 invocations.

Stubbings:
  - when called with \`(88)\`, then return \`5\`.
  - when called with \`("two things!")\`, then return \`"woah"\`, then \`"such"\`.

Invocations:
  - called with \`(88)\`.
  - called with \`("not 88", 44)\`.`,
            isTestDouble: true
        })
    },
    'a double with callback'() {
        td.when(testDouble(14)).thenCallback(null, 8)

        result = td.explain(testDouble)

        assert._isEqual(result, {
            name: undefined,
            calls: [],
            callCount: 0,
            description: `This test double has 1 stubbings and 0 invocations.

Stubbings:
  - when called with \`(14, callback)\`, then callback \`(null, 8)\`.`,
            isTestDouble: true
        })
    },
    'a double with resolve'() {
        td.when(testDouble(14)).thenResolve(8)

        result = td.explain(testDouble)

        assert._isEqual(result, {
            name: undefined,
            calls: [],
            callCount: 0,
            description: `This test double has 1 stubbings and 0 invocations.

Stubbings:
  - when called with \`(14)\`, then resolve \`8\`.`,
            isTestDouble: true
        })
    },
    'a double with reject'() {
        td.when(testDouble(14)).thenReject(8)

        result = td.explain(testDouble)

        assert._isEqual(result, {
            name: undefined,
            calls: [],
            callCount: 0,
            description: `This test double has 1 stubbings and 0 invocations.

Stubbings:
  - when called with \`(14)\`, then reject \`8\`.`,
            isTestDouble: true
        })
    },
    'passed a non-test double'() {
        testDouble = 42

        result = td.explain(testDouble)

        assert._isEqual(result, {
            name: undefined,
            calls: [],
            callCount: 0,
            description: 'This is not a test double.',
            isTestDouble: false
        })
    },
    'passed an object containing no test doubles'() {
        testDouble = {foo: () => 'foo'}

        result = td.explain(testDouble)

        assert._isEqual(result, {
            name: undefined,
            calls: [],
            callCount: 0,
            description: 'This is not a test double.',
            isTestDouble: false
        })
    },
    'passed an object containing a test double'() {
        testDouble = td.function('foo')

        let baz = {
            foo: testDouble,
            bar: () => 'bar'
        }

        td.when(testDouble()).thenReturn('FUBAR?')

        result = td.explain(baz)

        assert(result.isTestDouble)
        assert._isEqual(result.description,
            `This object contains 1 test double(s): [foo]`)

        assert._isEqual(result.foo, td.explain(testDouble));
    }
}
