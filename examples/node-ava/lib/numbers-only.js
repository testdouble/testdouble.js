var isNumber = require('is-number')

module.exports = function (thing) {
  if (!isNumber(thing)) {
    throw new Error('numbers only!')
  }
  return true
}
