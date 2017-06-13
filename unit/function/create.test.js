import Double from '../../src/value/double'
import CallLog from '../../src/value/call-log'
import StubbingRegister from '../../src/value/stubbing-register'
import Stubbing from '../../src/value/stubbing'
import subject from '../../src/function/create'

module.exports = {
  'passed a string name': () => {
    const result = subject('foo')

    assert(result instanceof Double)
    assert.strictEqual(result.real, null)
    assert.equal(result.name, 'foo')
    assert.equal(typeof result.fake, 'function')
    assert.equal(result.fake.toString(), '[test double for "foo"]')
  },
  'passed a function with a name': () => {
    function bar () {}
    const result = subject(bar)

    assert.equal(result.real, bar)
    assert.equal(result.name, 'bar')
    assert.equal(result.fake.toString(), '[test double for "bar"]')
  },
  'passed an unnamed function': () => {
    const result = subject(function () {})

    assert.strictEqual(result.name, null)
    assert.equal(result.fake.toString(), '[test double (unnamed)]')
  },
  'passed nothing': () => {
    const result = subject()

    assert.strictEqual(result.name, null)
    assert.strictEqual(result.real, null)
    assert.equal(result.fake.toString(), '[test double (unnamed)]')
  },
  'the fake function itself': {
    'logs calls': () => {
      const double = subject()

      double.fake.call('fake this', 1, 2, 3)

      var calls = CallLog.instance.for(double)
      assert.equal(calls.length, 1)
      assert.equal(calls[0].context, 'fake this')
      assert.deepEqual(calls[0].args, [1, 2, 3])
    },
    'registers stubbing': () => {
      const double = subject()
      const stubbing = new Stubbing('return', ['a', 'b'], ['c'])
      StubbingRegister.instance.add(double, stubbing)

      const result = double.fake('a', 'b')

      assert.equal(result, 'c')
    }
  },
  'toString supports mutation (necessary sometimes for td.replace() to depend on td.func()': () => {
    const double = subject()

    double.name = 'new name'

    assert.equal(double.name, 'new name')
    assert.equal(double.fake.toString(), '[test double for "new name"]')
  }
}
