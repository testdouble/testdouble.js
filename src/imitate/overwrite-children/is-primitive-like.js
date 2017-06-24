import _ from '../../wrap/lodash'

export default (thing) =>
  !_.isObject(thing) || _.compact([
    Boolean,
    Date,
    Number,
    RegExp,
    String,
    global.Symbol
  ]).some(type => thing instanceof type)
