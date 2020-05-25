'use strict'
const test = require('ava')
const td = require('testdouble')

class Person {
  age () {}
}

class EightiesGuy extends Person {
  hairspray () {
    return true
  }
}

test.afterEach(function (t) {
  td.reset()
})

test('instance-of', function (t) {
  const FakeEightiesGuy = td.constructor(EightiesGuy)

  const eightiesGuy = new FakeEightiesGuy()

  t.true(td.explain(eightiesGuy.age).isTestDouble)
  t.true(td.explain(eightiesGuy.hairspray).isTestDouble)
  t.true(eightiesGuy instanceof EightiesGuy)
  t.true(eightiesGuy instanceof Person)

  const otherGuy = td.instance(EightiesGuy)

  t.true(td.explain(otherGuy.age).isTestDouble)
  t.true(td.explain(otherGuy.hairspray).isTestDouble)
  t.true(otherGuy instanceof EightiesGuy)
  t.true(otherGuy instanceof Person)
})
