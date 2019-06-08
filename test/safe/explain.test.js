import * as theredoc from 'theredoc'

let testDouble, result
module.exports = {
  beforeEach () {
    testDouble = td.function()
  },
  'a brand new test double' () {
    result = td.explain(testDouble)

    assert._isEqual(result, {
      name: undefined,
      calls: [],
      callCount: 0,
      description: 'This test double has 0 stubbings and 0 invocations.',
      children: {
        toString: {
          name: undefined,
          callCount: 0,
          calls: [],
          description: 'This is not a test double function.',
          isTestDouble: false
        }
      },
      isTestDouble: true
    })
  },
  'a named test double' () {
    testDouble = td.function('foobaby')

    result = td.explain(testDouble)

    assert._isEqual(result.description, 'This test double `foobaby` has 0 stubbings and 0 invocations.')
    assert._isEqual(result.name, 'foobaby')
  },
  'a double with some interactions' () {
    td.when(testDouble(88)).thenReturn(5)
    td.when(testDouble('two things!')).thenReturn('woah', 'such')
    testDouble.call('lol', 88)
    testDouble.call('woo', 'not 88', 44)

    result = td.explain(testDouble)

    assert._isEqual(result, {
      name: undefined,
      calls: [
        { context: 'lol', args: [88], cloneArgs: [88] },
        { context: 'woo', args: ['not 88', 44], cloneArgs: ['not 88', 44] }
      ],
      callCount: 2,
      description: theredoc`
        This test double has 2 stubbings and 2 invocations.

        Stubbings:
          - when called with \`(88)\`, then return \`5\`.
          - when called with \`("two things!")\`, then return \`"woah"\`, then \`"such"\`.

        Invocations:
          - called with \`(88)\`.
          - called with \`("not 88", 44)\`.`,
      children: {
        toString: {
          name: undefined,
          callCount: 0,
          calls: [],
          description: 'This is not a test double function.',
          isTestDouble: false
        }
      },
      isTestDouble: true
    })
  },
  'a double with callback' () {
    td.when(testDouble(14)).thenCallback(null, 8)

    result = td.explain(testDouble)

    assert._isEqual(result, {
      name: undefined,
      calls: [],
      callCount: 0,
      description: theredoc`
        This test double has 1 stubbings and 0 invocations.

        Stubbings:
          - when called with \`(14, callback)\`, then callback \`(null, 8)\`.`,
      children: {
        toString: {
          name: undefined,
          callCount: 0,
          calls: [],
          description: 'This is not a test double function.',
          isTestDouble: false
        }
      },
      isTestDouble: true
    })
  },
  'a double with resolve' () {
    td.when(testDouble(14)).thenResolve(8)

    result = td.explain(testDouble)

    assert._isEqual(result, {
      name: undefined,
      calls: [],
      callCount: 0,
      description: theredoc`
        This test double has 1 stubbings and 0 invocations.

        Stubbings:
          - when called with \`(14)\`, then resolve \`8\`.`,
      children: {
        toString: {
          name: undefined,
          callCount: 0,
          calls: [],
          description: 'This is not a test double function.',
          isTestDouble: false
        }
      },
      isTestDouble: true
    })
  },
  'a double with reject' () {
    td.when(testDouble(14)).thenReject(8)

    result = td.explain(testDouble)

    assert._isEqual(result, {
      name: undefined,
      calls: [],
      callCount: 0,
      description: theredoc`
        This test double has 1 stubbings and 0 invocations.

        Stubbings:
          - when called with \`(14)\`, then reject \`8\`.`,
      children: {
        toString: {
          name: undefined,
          callCount: 0,
          calls: [],
          description: 'This is not a test double function.',
          isTestDouble: false
        }
      },
      isTestDouble: true
    })
  },
  'passed a non-test double' () {
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
  'passed an object containing no test doubles' () {
    testDouble = { foo: () => 'foo' }

    result = td.explain(testDouble)

    assert._isEqual(result, {
      name: null,
      callCount: 0,
      calls: [],
      description: 'This object contains no test doubles',
      children: {
        foo: {
          name: undefined,
          callCount: 0,
          calls: [],
          description: 'This is not a test double function.',
          isTestDouble: false
        }
      },
      isTestDouble: false
    })
  },
  'passed an object containing a test double' () {
    const baz = {
      foo: td.when(td.function('foo')()).thenReturn('biz'),
      bar: () => 'bar'
    }
    baz.foo()

    result = td.explain(baz)

    assert._isEqual(result, {
      name: null,
      callCount: 0,
      calls: [],
      description: theredoc`
        This object contains 1 test double function: ["foo"]
      `,
      children: {
        foo: {
          name: 'foo',
          callCount: 1,
          calls: [{
            args: [],
            cloneArgs: [],
            context: baz
          }],
          description: 'This test double `foo` has 1 stubbings and 1 invocations.\n\nStubbings:\n  - when called with `()`, then return `"biz"`.\n\nInvocations:\n  - called with `()`.',
          children: {
            toString: {
              name: undefined,
              callCount: 0,
              calls: [],
              description: 'This is not a test double function.',
              isTestDouble: false
            }
          },
          isTestDouble: true
        },
        bar: {
          name: undefined,
          callCount: 0,
          calls: [],
          description: 'This is not a test double function.',
          isTestDouble: false
        }
      },
      isTestDouble: true
    })
  },
  'passed an object with deeply nested test double functions' () {
    const realThing = {
      foo: 42,
      bar: {
        baz: function () {}
      }
    }
    const fakeThing = td.object(realThing)

    result = td.explain(fakeThing)

    assert._isEqual(result, {
      name: null,
      callCount: 0,
      calls: [],
      description: 'This object contains 1 test double function: [".bar.baz"]',
      children: {
        foo: 42,
        bar: {
          baz: {
            name: '.bar.baz',
            callCount: 0,
            calls: [],
            description: 'This test double `.bar.baz` has 0 stubbings and 0 invocations.',
            children: {
              toString: {
                name: undefined,
                callCount: 0,
                calls: [],
                description: 'This is not a test double function.',
                isTestDouble: false
              }
            },
            isTestDouble: true
          }
        },
        toString: {
          name: undefined,
          callCount: 0,
          calls: [],
          description: 'This is not a test double function.',
          isTestDouble: false
        }
      },
      isTestDouble: true
    })
  },
  'passed a function that contains test double children' () {
    const realThing = function foo () {}
    realThing.bar = function bar () {}
    const fakeThing = td.func(realThing)

    result = td.explain(fakeThing)

    assert._isEqual(result, {
      name: 'foo',
      callCount: 0,
      calls: [],
      description: 'This test double `foo` has 0 stubbings and 0 invocations.',
      children: {
        bar: {
          name: 'foo.bar',
          callCount: 0,
          calls: [],
          description: 'This test double `foo.bar` has 0 stubbings and 0 invocations.',
          children: {
            toString: {
              name: undefined,
              callCount: 0,
              calls: [],
              description: 'This is not a test double function.',
              isTestDouble: false
            }
          },
          isTestDouble: true
        },
        toString: {
          name: undefined,
          callCount: 0,
          calls: [],
          description: 'This is not a test double function.',
          isTestDouble: false
        }
      },
      isTestDouble: true
    })
  },
  'a double with a mutated argument' () {
    const person = { age: 17 }
    testDouble.call('hi', person)
    person.age = 30

    result = td.explain(testDouble)

    assert._isEqual(result, {
      name: undefined,
      calls: [
        { context: 'hi', args: [{ age: 30 }], cloneArgs: [{ age: 17 }] }
      ],
      callCount: 1,
      description: theredoc`
        This test double has 0 stubbings and 1 invocations.

        Invocations:
          - called with \`({age: 17})\`.`,
      children: {
        toString: {
          name: undefined,
          callCount: 0,
          calls: [],
          description: 'This is not a test double function.',
          isTestDouble: false
        }
      },
      isTestDouble: true
    })
  }

}
