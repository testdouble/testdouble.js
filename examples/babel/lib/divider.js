let numerator, divisor, execute
export default {
  numerator: {
    set: (val) => { numerator = val }
  },
  otherOptions: {
    divisor: {
      setThatToo: (val) => { divisor = val }
    }
  },
  ohAndAlso: {
    Executor: class Executor {
      constructor () {
        this.numerator = numerator
        this.divisor = divisor
      }
      execute () {
        return this.numerator / this.divisor
      }
    }
  }
}
