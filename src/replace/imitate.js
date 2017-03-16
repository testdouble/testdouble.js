const _ = require('../util/lodash-wrap')
const isConstructor = require('./is-constructor')
const tdConstructor = require('../constructor')
const tdObject = require('../object')
const tdFunction = require('../function')
const log = require('../log')
const stringifyAnything = require('../stringify/anything')

module.exports = (realThing, optionalName) => {
  if (isConstructor(realThing)) {
    return tdConstructor(realThing)
  } else if (_.isPlainObject(realThing)) {
    return tdObject(realThing)
  } else if (_.isFunction(realThing)) {
    return tdFunction(realThing, optionalName)
  } else {
    return log.error('td.replace', `"${optionalName}" property was found, but test double only knows how to replace functions, constructors, & objects containing functions (its value was ${stringifyAnything(realThing)}).`)
  }
}
