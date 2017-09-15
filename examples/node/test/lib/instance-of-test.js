// This isn't an example, this is just an extra test that td.js is
//  working as part of the project's build
module.exports = function () {
  'use strict'

  class Person {
    age () {}
  }
  class EightiesGuy extends Person {
    hairspray () {
      return true
    }
  }
  const FakeEightiesGuy = td.constructor(EightiesGuy)

  const eightiesGuy = new FakeEightiesGuy()

  assert.ok(td.explain(eightiesGuy.age).isTestDouble)
  assert.ok(td.explain(eightiesGuy.hairspray).isTestDouble)
  assert.ok(eightiesGuy instanceof EightiesGuy)
  assert.ok(eightiesGuy instanceof Person)
}
