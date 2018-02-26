import _ from '../wrap/lodash'

export default class Double {
  static create (name, real, parent, fakeCreator) {
    const double = new Double(name, real, parent)
    if (fakeCreator) double.fake = fakeCreator(double)
    return double
  }

  constructor (name, real, parent) {
    this.name = name
    this.real = real
    this.children = new Set()
    if (parent) {
      this.parent = parent
      parent.addChild(this)
    }
  }

  addChild (child) {
    this.children.add(child)
    child.parent = this
  }

  get fullName () {
    if (!_.some(_.map(this.ancestors, 'name'))) return this.name
    return _.map(this.ancestors.concat(this), (ancestor) =>
      ancestor.name == null ? '(unnamed)' : ancestor.name
    ).join('.')
  }

  get ancestors () {
    if (!this.parent) return []
    return this.parent.ancestors.concat(this.parent)
  }

  toString () {
    return this.fullName == null ? '[test double (unnamed)]' : `[test double for "${this.fullName}"]`
  }
}
