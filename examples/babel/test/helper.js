import td from 'testdouble'

export { td }

export function setup () {}

export function teardown () {
  td.reset()
}
