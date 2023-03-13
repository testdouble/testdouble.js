import _ from '../../wrap/lodash'
import isGenerator from '../is-generator'

export default (thing) =>
  !(!_.isObject(thing) || isBoxedType(thing) || isGenerator(thing))

const isBoxedType = (thing) =>
  _.compact([
    Boolean,
    Date,
    Number,
    RegExp,
    String,
    Symbol
  ]).some(type => thing instanceof type)
