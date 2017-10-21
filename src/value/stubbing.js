export default class Stubbing {
  constructor (type, args, outcomes, options = {}) {
    this.type = type
    this.args = args
    this.outcomes = outcomes
    this.options = options
    this.satisfactionCount = 0
  }

  get hasTimesRemaining () {
    if (this.options.times == null) return true
    return this.satisfactionCount < this.options.times
  }

  incrementSatisfactions () {
    this.satisfactionCount++
  }
}
