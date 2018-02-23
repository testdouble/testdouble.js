let testDouble
module.exports = {
  'making a test double based on a plain object funcbag' () {
    const funcBag = {
      lol: function () {},
      kek: function () {},
      now: function () {},
      otherThing: 8
    }
    testDouble = td.object(funcBag)

    td.when(testDouble.kek()).thenReturn('nay!')

    assert._isEqual(testDouble.kek(), 'nay!')
    assert._isEqual(testDouble.toString(), '[test double object]')
    assert._isEqual(testDouble.now.toString(), '[test double for ".now"]')
    assert._isEqual(testDouble.otherThing, 8)
  },
  'creating an object that is an instance of a prototypal thing' () {
    function Thing () {}
    Thing.prototype.foo = () => 'bar'

    testDouble = td.object(new Thing())

    assert._isEqual(td.explain(testDouble.foo).isTestDouble, true)
  },
  'making a test double based on an array of strings' () {
    testDouble = td.object(['biz', 'bam', 'boo'])

    td.when(testDouble.biz()).thenReturn('zing!')

    assert._isEqual(testDouble.biz(), 'zing!')
    assert._isEqual(testDouble.toString(), '[test double object]')
    assert._isEqual(testDouble.bam.toString(), '[test double for ".bam"]')
  },
  'making a test double based on a Symbol' () {
    if (!global.Symbol) return
    const symbolFoo = Symbol('foo')
    testDouble = td.object([symbolFoo])

    td.when(testDouble[symbolFoo]()).thenReturn('zing!')

    assert._isEqual(testDouble[symbolFoo](), 'zing!')
    assert._isEqual(testDouble.toString(), '[test double object]')
    assert._isEqual(testDouble[symbolFoo].toString(), '[test double for ".Symbol(foo)"]')
  },
  'passing a function to td.object erroneously (1.x)' () {
    try {
      td.object(function () {})
      assert.fail('This should have errored!')
    } catch (e) {
      assert.ok(/Please use `td\.function\(\)` or `td\.constructor\(\)` instead/.test(e.message))
    }
  },
  'passing an Object.create()d thing' () {
    testDouble = td.object(Object.create({
      respond: () => 'no'
    }))

    assert._isEqual(td.explain(testDouble.respond).isTestDouble, true)
  },
  'passing undefined raises error / compatibility note' () {
    try {
      td.object(undefined)
      assert.fail('This should have errored!')
    } catch (e) {
      assert.ok(/pass it a plain object/.test(e.message))
    }
  },
  'creating a ES Proxy object': {
    'basic use' () {
      if (!global.Proxy) return
      testDouble = td.object('thing')
      testDouble.magic('sauce')

      td.when(testDouble.whateverYouWant()).thenReturn('YESS')
      td.verify(testDouble.magic('sauce'))
      assert._isEqual(testDouble.whateverYouWant(), 'YESS')
      assert._isEqual(testDouble.toString(), '[test double object for "thing"]')
      assert._isEqual(testDouble.foo.toString(), '[test double for "thing.foo"]')
    },
    'with custom excludeMethods definitions' () {
      if (!global.Proxy) return
      testDouble = td.object('Stuff', {
        excludeMethods: ['then', 'fun']
      })

      assert._isEqual(testDouble.fun, undefined)
    },
    'unnamed double' () {
      if (!global.Proxy) return
      testDouble = td.object()

      assert._isEqual(testDouble.toString(), '[test double object]')
      assert._isEqual(testDouble.lol.toString(), '[test double for ".lol"]')
    },
    'with Symbol propKey' () {
      if (!global.Proxy || !global.Symbol) return
      testDouble = td.object('thing')
      assert._isEqual(testDouble[Symbol('foo')].toString(), '[test double for "thing.Symbol(foo)"]')
    },
    'if Proxy is not defined will print an error message' () {
      if (global.Proxy) return
      try {
        td.object('Woah')
        assert.fail('Show have errored!')
      } catch (e) {
        assert._isEqual(e.message, "Error: testdouble.js - td.object - The current runtime does not have Proxy support, which is what\ntestdouble.js depends on when a string name is passed to `td.object()`.\n\nMore details here:\n  https://github.com/testdouble/testdouble.js/blob/master/docs/4-creating-test-doubles.md#objectobjectname\n\nDid you mean `td.object(['Woah'])`?")
      }
    }
  }
}
