import _ from './lodash'

export default function proxySafeCloneDeepWith (thing, callback) {
  return _.cloneDeepWith(thing, (val, key, obj, stack) => {
    if (isSafeWithProxy(key)) {
      return callback(val, key, obj, stack)
    }
  })
}

function isSafeWithProxy (key) {
  return key &&
    key !== 'constructor' &&
    (!key.toString || key.toString() !== 'Symbol(Symbol.toStringTag)')
}
