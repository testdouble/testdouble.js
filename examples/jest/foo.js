const bar = require('./bar')
const baz = require('./baz')
const qux = require('./qux')
const quux = require('./quux')

module.exports = function () {
  quux(1337)
  return {
    bar: bar(42),
    baz: baz(),
    qux: qux()
  }
}

