import * as td from 'testdouble'

function assertEqual (actual, expected) {
  if (actual !== expected) {
    throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`)
  }
}

function assertThrows (fn, pattern) {
  try {
    fn()
  } catch (e) {
    if (!pattern.test(e.message)) {
      throw new Error(`Expected an error matching ${pattern}, got: ${e.message}`)
    }
    return
  }
  throw new Error(`Expected an error matching ${pattern}, but nothing was thrown`)
}

class Car {
  honk () { return 'beep' }
}

describe('testdouble in the browser', () => {
  afterEach(() => {
    td.reset()
  })

  it('stubs test double functions', () => {
    const drive = td.func('drive')
    td.when(drive('fast')).thenReturn('vroom')

    assertEqual(drive('fast'), 'vroom')
  })

  it('verifies test double functions', () => {
    const park = td.func('park')

    park('garage')

    td.verify(park('garage'))
  })

  it('creates test double objects', () => {
    const car = td.object(new Car())
    td.when(car.honk()).thenReturn('honk honk')

    assertEqual(car.honk(), 'honk honk')
  })

  it('replaces properties on objects', () => {
    const garage = { car: new Car() }
    const fakeCar = td.replace(garage, 'car')
    td.when(fakeCar.honk()).thenReturn('fake beep')

    assertEqual(garage.car.honk(), 'fake beep')
  })

  it('does not support replacing CommonJS modules', () => {
    assertThrows(() => td.replace('./some-module.js'), /only supported under Node\.js/)
  })

  it('does not support replacing ES modules', () => {
    assertThrows(() => td.replaceEsm('./some-module.js'), /only supported under Node\.js/)
  })

  it('lists no replaced modules', () => {
    assertEqual(td.listReplacedModules().length, 0)
  })
})
