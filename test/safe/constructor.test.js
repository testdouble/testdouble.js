let Thing, SuperThing, FakeConstructor, fakeInstance

module.exports = {
  'being given a constructor function': {
    beforeEach () {
      SuperThing = function SuperThing () {}
      SuperThing.prototype.biz = () => 1
      Object.defineProperties(SuperThing.prototype, {
        secretFunc: {
          value () {},
          enumerable: false,
          writable: true
        }
      })

      Thing = function Thing () {}
      Thing.prototype = new SuperThing()
      Thing.prototype.foo = () => 2
      Thing.bar = () => 3
      Thing.prototype.instanceAttr = 'baz'
      Thing.staticAttr = 'qux'
      Object.defineProperties(Thing, {
        secretStaticFunc: {
          value () {},
          enumerable: false,
          writable: true
        }
      })

      FakeConstructor = td.constructor(Thing)
      fakeInstance = new FakeConstructor('pants')
    },
    'the constructor function itself is called' () {
      td.verify(new FakeConstructor('pants'))
    },
    'stubbing it (with an error, return makes no sense)' () {
      let error
      td.when(new FakeConstructor('!')).thenThrow('¡')

      try {
        new FakeConstructor('!') // eslint-disable-line
      } catch (e) {
        error = e
      }

      assert._isEqual(error, '¡')
    },
    'instance methods can be stubbed' () {
      td.when(fakeInstance.foo()).thenReturn(7)

      assert._isEqual(fakeInstance.foo(), 7)
    },
    'stub method on prototype, use from any instance' () {
      td.when(FakeConstructor.prototype.foo()).thenReturn(4)

      assert._isEqual(FakeConstructor.prototype.foo(), 4)
      assert._isEqual(fakeInstance.foo(), 4)
    },
    'the static method can be stubbed' () {
      td.when(FakeConstructor.bar()).thenReturn(5)

      assert._isEqual(FakeConstructor.bar(), 5)
    },
    'super type methods can be stubbed, too' () {
      td.when(fakeInstance.biz()).thenReturn(6)

      assert._isEqual(fakeInstance.biz(), 6)
    },
    'things print OK' () {
      assert._isEqual(FakeConstructor.toString(), '[test double for "Thing"]')
      assert._isEqual(FakeConstructor.prototype.foo.toString(), '[test double for "Thing.prototype.foo"]')
      assert._isEqual(FakeConstructor.bar.toString(), '[test double for "Thing.bar"]')
    },
    'non-enumerables are covered' () {
      assert._isEqual(td.explain(FakeConstructor.secretStaticFunc).isTestDouble, true)
      assert._isEqual(td.explain(fakeInstance.secretFunc).isTestDouble, true)
    },
    'instanceof checks out' () {
      assert._isEqual(fakeInstance instanceof Thing, true)
    },
    'original attributes are carried over' () {
      assert._isEqual(FakeConstructor.prototype.instanceAttr, 'baz')
      assert._isEqual(fakeInstance.instanceAttr, 'baz')
      assert._isEqual(FakeConstructor.staticAttr, 'qux')
    }
  },
  'being given an array of function names' () {
    FakeConstructor = td.constructor(['foo', 'bar'])
    fakeInstance = new FakeConstructor('biz')

    assert._isEqual(FakeConstructor.prototype.foo, fakeInstance.foo)
    td.verify(new FakeConstructor('biz'))
    assert._isEqual(td.explain(fakeInstance.foo).isTestDouble, true)
    assert._isEqual(td.explain(fakeInstance.bar).isTestDouble, true)
    assert._isEqual(FakeConstructor.toString(), '[test double for "(unnamed constructor)"]')
    assert._isEqual(fakeInstance.toString(), '[test double instance of constructor]')
    assert._isEqual(fakeInstance.foo.toString(), '[test double for "#foo"]')
  },
  'edge case: being given a Symbol as function name' () {
    const symbolFoo = Symbol('foo')
    FakeConstructor = td.constructor([symbolFoo])
    fakeInstance = new FakeConstructor('biz')

    assert._isEqual(FakeConstructor.prototype[symbolFoo], fakeInstance[symbolFoo])
    td.verify(new FakeConstructor('biz'))
    assert._isEqual(td.explain(fakeInstance[symbolFoo]).isTestDouble, true)
    assert._isEqual(FakeConstructor.toString(), '[test double for "(unnamed constructor)"]')
    assert._isEqual(fakeInstance.toString(), '[test double instance of constructor]')
    assert._isEqual(fakeInstance[symbolFoo].toString(), '[test double for "#Symbol(foo)"]')
  },
  'edge case: being given a function without prototypal methods' () {
    const boringFunc = function () {}
    boringFunc.foo = function () {}

    const fakeFunc = td.constructor(boringFunc)

    assert._isEqual(td.explain(fakeFunc.foo).isTestDouble, true)
  }
}
