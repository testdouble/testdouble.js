module.exports = {
  '.toString': () => {
    assert._isEqual(td.function('boo!').toString(), '[test double for "boo!"]')
    assert._isEqual(td.function().toString(), '[test double (unnamed)]')
    assert._isEqual(td.function(function () {}).toString(), '[test double for "(anonymous function)"]')
    assert._isEqual(td.function(function Lol () {}).toString(), '[test double for "Lol"]')
  },
  'copying properties on functions': () => {
    const func = (function () { return function () {} })()
    func.foo = function () {}
    func.bar = 42

    const result = td.function(func)

    assert._isEqual(result.toString(), '[test double for "(anonymous function)"]')
    assert._isEqual(result.foo.toString(), '[test double for ".foo"]')
    assert._isEqual(result.bar, 42)
  },
  'inherited props too': () => {
    class Thing {}
    Thing.staticFunc = function () {}
    Thing.staticProp = 42
    class SubThing extends Thing {}

    const result = td.func(SubThing)

    assert._isEqual(td.explain(result.staticFunc).isTestDouble, true)
    assert._isEqual(result.staticProp, 42)
  },
  'non-enumerable props too': () => {
    const func = function () {}
    Object.defineProperties(func, {
      foo: {
        value: function () {},
        enumerable: false
      },
      bar: {
        value: 42,
        enumerable: false
      }
    })

    const result = td.func(func)

    assert._isEqual(td.explain(result.foo).isTestDouble, true)
    assert._isEqual(result.bar, 42)
  }

}
