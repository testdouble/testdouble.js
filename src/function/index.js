import _ from '../wrap/lodash'

import create from './create'
import imitate from './imitate'
import remember from './remember'

export default (nameOrFunc) =>
  _.isFunction(nameOrFunc)
    ? remember(imitate(nameOrFunc, create(nameOrFunc.name)), nameOrFunc.name)
    : remember(create(nameOrFunc), nameOrFunc)
