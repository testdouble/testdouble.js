import * as td from '../..'

class Dog {
  bark () {}
}

class Cat {
  meow (): string { return 'meow! meow!' }
}

function sum (first: number, second: number): number {
  return first + second
}

export = {
  'play with some typescript' () {
    const dog = td.constructor(Dog)
    td.when(dog.prototype.bark()).thenReturn('woof!')

    const bird = td.object({ fly: function () {} })
    td.when(bird.fly()).thenReturn('swoosh!')

    const kitty = td.object(['scratch', 'meow'])
    td.when(kitty.scratch()).thenReturn('scratch!')
    td.when(kitty.meow()).thenReturn('meow!')

    if (eval('typeof Proxy') !== 'undefined') { // eslint-disable-line
      class Bear { sleep () {} }

      const FakeBear = td.constructor<Class>(Bear)

      assert.equal(td.explain(FakeBear.prototype.sleep).isTestDouble, true)

      const bear = td.object<Bear>('A bear')

      td.when(bear.sleep()).thenReturn('zzzzzz')

      assert.equal(bear.sleep(), 'zzzzzz')
    }

    const testObject = {
      funk: function () {}
    }

    td.replace(testObject, 'funk')
    td.replace(testObject, 'funk', () => 42)
    td.replace('../..')
    td.replace('../../', 42)

    const f = td.function()
    td.when(f(10)).thenReturn(10, 11)
    td.when(f(1)).thenThrow(new Error('ok'))
    td.when(f(td.matchers.isA(String))).thenDo(function (s: string) { return s })
    td.when(f(td.matchers.not(true))).thenResolve('value1', 'value2')
    td.when(f(td.matchers.not(false))).thenReject(new Error('rejected'))

    const fakeSum = td.function(sum)
    td.when(fakeSum(1, 2)).thenReturn(3)

    const fakestSum = td.function('sum')
    td.when(fakestSum(1, 2)).thenReturn(3)

    f()
    td.verify(f())
    td.verify(f(), { times: 1 })
    td.verify(f(), { ignoreExtraArgs: false })
    td.verify(f(), { ignoreExtraArgs: true, times: 1 })

    const CatFake = td.constructor(Cat)
    const cat = new CatFake()
    td.when(cat.meow()).thenReturn('moo!')

    const explanation = td.explain(f)

    assert.equal(
      explanation.description.split('\n')[0],
      'This test double has 5 stubbings and 1 invocations.'
    )
  }
}
