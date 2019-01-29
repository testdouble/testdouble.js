let instance = null

export default class CallLog {
  static get instance () {
    if (instance) return instance
    instance = new CallLog()
    return instance
  }

  static reset () {
    instance = null
  }

  constructor () {
    this.calls = new Map()
    this.callHistory = []
  }

  log (double, call) {
    this.callHistory.push({ double, call })
    if (this.calls.has(double)) {
      this.calls.get(double).push(call)
    } else {
      this.calls.set(double, [call])
    }
  }

  for (double) {
    return this.calls.get(double)
  }

  pop () {
    const lastCall = this.callHistory.pop()
    if (lastCall && this.calls.has(lastCall.double)) {
      this.calls.get(lastCall.double).pop()
    }
    return lastCall
  }
}
