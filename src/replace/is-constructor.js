const _ = require('../util/lodash-wrap')

module.exports = (thing) =>
  thing && thing.prototype && _.some(Object.getOwnPropertyNames(thing.prototype), property =>
    property !== 'constructor' && _.isFunction(thing.prototype[property]))
