import _ from '../wrap/lodash'

export default class Stubbing {
  constructor (type, args, outcomes, options = {}) {
    this.type = type
    this.args = args
    this.outcomes = outcomes
    this.options = options
    this.satisfyingCalls = new Set()
  }

  get hasTimesRemaining () {
    if (this.options.times == null) return true
    return this.satisfyingCalls.size < this.options.times
  }

  get currentOutcome () {
    const outcomeIndex = Math.max(0, this.satisfyingCalls.size - 1)
    if (outcomeIndex < this.outcomes.length) {
      return this.outcomes[outcomeIndex]
    } else {
      return _.last(this.outcomes)
    }
  }

  addSatisfyingCall (call) {
    this.satisfyingCalls.add(call)
  }
}
