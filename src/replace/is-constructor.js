let _ = require('../util/lodash-wrap')

module.exports = function (thing) {
  if ((thing != null ? thing.prototype : undefined) == null) { return }
  return _.some(Object.getOwnPropertyNames(thing.prototype), property => (property !== 'constructor') && _.isFunction(thing.prototype[property]))
}
