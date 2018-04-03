import * as Map from 'es6-map'

let instance = null

export default class StubbingRegister {
  stubbings: Map<any>

  constructor () {
    this.stubbings = new Map()
  }

  static get instance () {
    if (instance) return instance
    instance = new StubbingRegister()
    return instance
  }

  static reset () {
    instance = null
  }

  add (double, stubbing) {
    if (this.stubbings.has(double)) {
      this.stubbings.get(double).push(stubbing)
    } else {
      this.stubbings.set(double, [stubbing])
    }
  }

  get (double) {
    return this.stubbings.get(double)
  }
}
