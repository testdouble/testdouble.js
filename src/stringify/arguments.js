import _ from '../util/lodash-wrap'
import stringifyAnything from './anything'

export default (args, joiner = ', ', wrapper = '') =>
  _.map(args, arg =>
    `${wrapper}${stringifyAnything(arg)}${wrapper}`
  ).join(joiner)
