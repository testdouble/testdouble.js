import _ from '../wrap/lodash'

import isCallback from '../matchers/is-callback'
import callback from '../callback'

export default function (type, args) {
  if (type === 'thenCallback' && !_.some(args, isCallback)) {
    return args.concat(callback)
  } else {
    return args
  }
}
