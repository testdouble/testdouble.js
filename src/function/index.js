import _ from '../wrap/lodash'

import create from './create'
import imitate from '../imitate'
import remember from './remember'

export default (nameOrFunc) => {
  if (_.isFunction(nameOrFunc)) return imitate(nameOrFunc)
  const double = create(nameOrFunc)
  remember(double)
  return double.fake
}
