export default class Stubbing {
  constructor (type, args, outcomes, options = {}) {
    this.type = type
    this.args = args
    this.outcomes = outcomes
    this.options = options
  }
}
