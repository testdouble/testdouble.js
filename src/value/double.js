import _ from '../wrap/lodash'

export default class Double {
  constructor (name, real, fake) {
    this.name = name
    this.real = real
    this.fake = fake
    this.parent = undefined
    this.children = new Set()
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
}
