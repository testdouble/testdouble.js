import _ from '../util/lodash-wrap'
import isConstructor from './is-constructor'
import log from '../log'
import stringifyAnything from '../stringify/anything'
import tdConstructor from '../constructor'
import tdFunction from '../function'
import tdObject from '../object'

export default (realThing, optionalName) => {
  if (isConstructor(realThing)) {
    return tdConstructor(realThing)
  } else if (_.isFunction(realThing)) {
    return tdFunction(realThing, optionalName)
  } else if (_.isObjectLike(realThing)) {
    return tdObject(realThing)
  } else {
    return log.error('td.replace', `"${optionalName}" property was found, but test double only knows how to replace functions, constructors, & objects containing functions (its value was ${stringifyAnything(realThing)}).`)
  }
}
