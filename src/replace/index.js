import _ from '../util/lodash-wrap'
import quibble from 'quibble'
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
