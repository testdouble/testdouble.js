import * as td from 'testdouble'

function check (condition, message) {
  if (!condition) throw new Error(`ES module entry: ${message}`)
}

const fn = td.func('fn')
td.when(fn('hi')).thenReturn('hello')
check(fn('hi') === 'hello', 'td.when stubbing failed')
const log = td.func('log')
log('bye')
td.verify(log('bye'))

check(td.listReplacedModules().length === 0, 'td.listReplacedModules() should be []')

let error
try {
  td.replaceEsm('./some-module.js')
} catch (e) {
  error = e
}
check(error && /only supported under Node\.js/.test(error.message),
  `td.replaceEsm() should throw a Node.js-only error, got: ${error}`)

console.log('ES module entry passed')
