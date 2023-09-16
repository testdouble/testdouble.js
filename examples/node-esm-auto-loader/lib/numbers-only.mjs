import isNumber from 'is-number'

export default function (thing) {
  if (!isNumber(thing)) {
    throw new Error('numbers only!')
  }
  return true
}
