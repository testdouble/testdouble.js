import _ from '../../wrap/lodash'

export default function fakeName (path, realThing) {
  return `${path}: ${nameFor(realThing)}`
}

const nameFor = (realThing) => {
  if (!_.isFunction(realThing)) return ''
  return realThing.name ? realThing.name : '(anonymous function)'
}
