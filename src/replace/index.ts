import _ from '../wrap/lodash'
import * as quibble from 'quibble'
import replaceModule from './module'
import replaceProperty from './property'

quibble.ignoreCallsFromThisFile()

export default function (target, ...rest) {
  if (_.isString(target)) {
    return replaceModule(target, ...rest)
  } else {
    return replaceProperty(target, rest[0], ...rest.slice(1))
  }
}
