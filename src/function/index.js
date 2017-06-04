import _ from '../wrap/lodash'

import create from './create'
import imitate from './imitate'
import remember from './remember'

export default (nameOrFunc) => {
  const double = create(nameOrFunc)
  if (_.isFunction(nameOrFunc)) {
    imitate(double)
  }
  remember(double)
  return double.fake
}
