import Call from './call'

let instance = null

export default class CallLog {
  static get instance () {
    if (instance) return instance
    instance = new CallLog()
    return instance
  }

  constructor () {
    this.calls = new Map()
  }

  log (double, call) {
    if (this.calls.has(double)) {
      this.calls.get(double).push(call)
    } else {
      this.calls.set(double, [call])
    }
  }

  for (double) {
    return this.calls.get(double)
  }
}
