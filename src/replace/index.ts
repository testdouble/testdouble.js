import _ from '../wrap/lodash'
import * as quibble from 'quibble'
import replaceModule from './module'
import replaceProperty from './property'

quibble.ignoreCallsFromThisFile()

export default function (target) {
  if (_.isString(target)) {
    return replaceModule(...arguments)
  } else {
    return replaceProperty(...arguments)
  }
}
