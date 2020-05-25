let Thing, SuperThing, fakeInstance

module.exports = {
  'being given an mock object instance': {
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

      fakeInstance = td.instance(Thing)
    },
    'instance methods can be stubbed' () {
      td.when(fakeInstance.foo()).thenReturn(7)

      assert._isEqual(fakeInstance.foo(), 7)
    },
    'super type methods can be stubbed, too' () {
      td.when(fakeInstance.biz()).thenReturn(6)

      assert._isEqual(fakeInstance.biz(), 6)
    },
    'things print OK' () {
      assert._isEqual(fakeInstance.foo.toString(), '[test double for "Thing.prototype.foo"]')
    },
    'non-enumerables are covered' () {
      assert._isEqual(td.explain(fakeInstance.secretFunc).isTestDouble, true)
    },
    'instanceof checks out' () {
      assert._isEqual(fakeInstance instanceof Thing, true)
    },
    'original attributes are carried over' () {
      assert._isEqual(fakeInstance.instanceAttr, 'baz')
    }
  }
}
