import _ from '../wrap/lodash'

export default (thing) =>
  thing && thing.prototype && _.some(Object.getOwnPropertyNames(thing.prototype), property =>
    property !== 'constructor' && _.isFunction(thing.prototype[property]))
