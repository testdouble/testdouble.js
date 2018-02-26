import _ from '../wrap/lodash'

export default function callLater (func, args, defer, delay) {
  if (delay) {
    _.delay(func, delay, ...args)
  } else if (defer) {
    _.defer(func, ...args)
  } else {
    func(...args)
  }
}
